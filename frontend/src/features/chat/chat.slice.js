import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[ chatId ] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload
            state.chats[ chatId ].messages.push({ content, role })
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[ chatId ].messages.push(...messages)
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        clearCurrentChat: (state) => {
            state.currentChatId = null
        },
        // 👇 ADDED: Reducer to remove a specific chat
        removeChat: (state, action) => {
            const chatIdToDelete = action.payload;
            delete state.chats[chatIdToDelete];
            
            // If the user deleted the chat they were currently looking at, go to home screen
            if (state.currentChatId === chatIdToDelete) {
                state.currentChatId = null;
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    }
})

// 👇 Don't forget to export removeChat here!
export const { setChats, setCurrentChatId, clearCurrentChat, removeChat, setLoading, setError, createNewChat, addNewMessage, addMessages } = chatSlice.actions
export default chatSlice.reducer