import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat'; 

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import LandingView from '../components/LandingView'; 
import LoadingMessage from '../components/LoadingMessage'; 

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState('');
  
  
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef(null); 

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []); 

  const activeMessages = chats?.[currentChatId]?.messages || [];
  
  
useEffect(() => {
   
    const lastMessage = activeMessages[activeMessages.length - 1];
    
    if (lastMessage && lastMessage.role !== 'user') {
      setIsSearching(false);
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    
   
  }, [activeMessages.length, activeMessages[activeMessages.length - 1]?.content]);

  const handleSubmitMessage = (event) => {
    event?.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    
    setIsSearching(true); 
    
    
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput('');
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
    setIsSearching(false); 
  };

  const currentChatTitle = chats?.[currentChatId]?.title;
  
 
  const isNewOrEmptyChat = activeMessages.length === 0 && !isSearching;

  const handleNewChat = () => {
    
    chat.handleCreateNewChat(); 
  
    setIsSearching(false);
    
    setChatInput('');
  };

  return (
    <main className='flex h-screen w-full bg-[#0d0f17] text-[#e8e8f0] font-sans overflow-hidden'>
      <Sidebar 
        chats={chats} 
        currentChatId={currentChatId} 
        onOpenChat={openChat} 
     
        onNewChat={handleNewChat} 
      />

      <section className='relative flex flex-1 flex-col h-full min-w-0'>
        {!isNewOrEmptyChat && <Topbar title={currentChatTitle} />}

        {isNewOrEmptyChat ? (
          <LandingView 
            input={chatInput} 
            setInput={setChatInput} 
            onSubmit={handleSubmitMessage} 
          />
        ) : (
          <>
           
            <div ref={scrollRef} className='flex-1 overflow-y-auto w-full pb-40 custom-scrollbar scroll-smooth'>
              <div className='mx-auto max-w-[720px] w-full px-4 pt-10 md:px-0 flex flex-col'>
                
                
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