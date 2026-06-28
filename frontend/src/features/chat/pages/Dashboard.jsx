import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useChat } from "../hooks/useChat";
import { getMe, logout } from "../../service/auth.api";
import { clearCurrentChat, setChats } from "../chat.slice";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import LandingView from "../components/LandingView";
import LoadingMessage from "../components/LoadingMessage";

const Dashboard = () => {
  const chat = useChat();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [chatInput, setChatInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user || data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const activeMessages = chats?.[currentChatId]?.messages || [];

  useEffect(() => {
    const lastMessage = activeMessages[activeMessages.length - 1];

    if (lastMessage && lastMessage.role !== "user") {
      setIsSearching(false);
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [
    activeMessages.length,
    activeMessages[activeMessages.length - 1]?.content,
  ]);

  const handleSubmitMessage = (event, imageBase64 = null) => {
    event?.preventDefault();
    const trimmedMessage = chatInput.trim();

    if (!trimmedMessage && !imageBase64) return;

    setIsSearching(true);

    chat.handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId,
      imageBase64: imageBase64,
    });

    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
    setIsSearching(false);
  };

  const handleNewChat = () => {
    chat.handleCreateNewChat();
    setIsSearching(false);
    setChatInput("");
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearCurrentChat());
      dispatch(setChats({}));

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      window.location.href = "/login";
    }
  };

  const currentChatTitle = chats?.[currentChatId]?.title;
  const isNewOrEmptyChat = activeMessages.length === 0 && !isSearching;

  return (
    <main className="flex h-screen w-full bg-[#0d0f17] text-[#e8e8f0] font-sans overflow-hidden">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onOpenChat={openChat}
        onNewChat={handleNewChat}
        user={user}
        onLogout={handleLogout}
        onDeleteChat={chat.handleDeleteChat}
      />

      <section className="relative flex flex-1 flex-col h-full min-w-0">
        {!isNewOrEmptyChat && <Topbar title={currentChatTitle} />}

        {isNewOrEmptyChat ? (
          <LandingView
            input={chatInput}
            setInput={setChatInput}
            onSubmit={handleSubmitMessage}
          />
        ) : (
          <>
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto w-full pb-40 custom-scrollbar scroll-smooth"
            >
              <div className="mx-auto max-w-[720px] w-full px-4 pt-10 md:px-0 flex flex-col">
                {activeMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isSearching && <LoadingMessage />}
              </div>
            </div>

            <ChatInput
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onSubmit={handleSubmitMessage}
              disabled={isSearching}
            />
          </>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
