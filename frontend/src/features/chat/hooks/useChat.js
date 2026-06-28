import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  clearCurrentChat,
  removeChat,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId, imageBase64 }) {
    dispatch(setLoading(true));
    const data = await sendMessage({ message, chatId, imageBase64 });

    const { chat, aiMessage } = data;
    if (!chatId)
      dispatch(
        createNewChat({
          chatId: chat._id,
          title: chat.title,
        }),
      );

    dispatch(
      addNewMessage({
        chatId: chatId || chat._id,
        content: message,
        role: "user",
        imageBase64: imageBase64,
      }),
    );

    dispatch(
      addNewMessage({
        chatId: chatId || chat._id,
        content: aiMessage.content,
        role: aiMessage.role,
      }),
    );

    dispatch(setCurrentChatId(chat._id));
  }

  async function handleGetChats() {
    dispatch(setLoading(true));
    const data = await getChats();
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );
    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId, chats) {
    console.log(chats[chatId]?.messages.length);

    if (chats[chatId]?.messages.length === 0) {
      const data = await getMessages(chatId);
      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
        imageBase64: msg.imageBase64 || null,
      }));

      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
    }
    dispatch(setCurrentChatId(chatId));
  }

  function handleCreateNewChat() {
    dispatch(clearCurrentChat());
  }

  async function handleDeleteChat(chatId) {
    try {
      dispatch(setLoading(true));
      await deleteChat(chatId);
      dispatch(removeChat(chatId));
    } catch (error) {
      console.error("Failed to delete chat:", error);
      dispatch(setError("Failed to delete chat"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleCreateNewChat,
    handleDeleteChat,
  };
};
