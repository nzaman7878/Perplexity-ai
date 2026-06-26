import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) {
      return
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId)
  }

  const currentChatTitle = chats[currentChatId]?.title || 'New Thread'

  return (
    <main className='flex h-screen w-full bg-[#0d0f17] text-[#e8e8f0] font-sans selection:bg-[#5b5bd6]/30 overflow-hidden'>
      
      {/* Sidebar - Deep Navy Panel */}
      <aside className='hidden w-[260px] flex-shrink-0 flex-col border-r border-[#161926] bg-[#11131d] md:flex'>
        <div className='p-4 pb-2'>
          <h1 className='mb-6 flex items-center gap-2 text-xl font-semibold tracking-tight text-[#e8e8f0]'>
            {/* Minimalist Logo Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e8e8f0]">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="16"></line>
            </svg>
            Perplexity
          </h1>
          
          <button 
            type="button"
            className='mb-4 flex w-full items-center justify-between gap-2 rounded-full border border-[#20213a] bg-transparent px-4 py-2.5 text-sm font-medium text-[#e8e8f0] transition-colors hover:bg-[#161926]'
          >
            <span className='flex items-center gap-2'>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New Thread
            </span>
            <span className='text-xs text-[#6e6e8a]'>Ctrl I</span>
          </button>
        </div>

        <div className='flex-1 space-y-[2px] overflow-y-auto px-2 pb-4 custom-scrollbar'>
          <p className='px-3 py-2 text-xs font-semibold text-[#6e6e8a] uppercase tracking-wider'>Recent</p>
          {Object.values(chats).map((chatObj) => {
            const isActive = chatObj.id === currentChatId;
            return (
              <button
                onClick={() => openChat(chatObj.id)}
                key={chatObj.id}
                type='button'
                className={`group relative flex w-full cursor-pointer items-center truncate rounded-lg px-3 py-2 text-left text-[14px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#161926] text-[#e8e8f0]'
                    : 'text-[#6e6e8a] hover:bg-[#161926]/50 hover:text-[#e8e8f0]'
                }`}
              >
                {/* Active Left Accent Line */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#5b5bd6]" />
                )}
                <span className="truncate">{chatObj.title}</span>
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <section className='relative flex flex-1 flex-col h-full min-w-0'>
        
        {/* Topbar */}
        <header className='flex h-14 shrink-0 items-center justify-between border-b border-[#161926] px-4 md:px-6'>
          <h2 className='truncate text-sm font-medium text-[#e8e8f0] md:max-w-[400px]'>
            {currentChatTitle}
          </h2>
          <button className='flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#6e6e8a] transition-colors hover:bg-[#161926] hover:text-[#e8e8f0]'>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Share
          </button>
        </header>

        {/* Scrollable Chat Region */}
        <div className='flex-1 overflow-y-auto w-full pb-40'>
          {/* Constrained Center Column */}
          <div className='mx-auto max-w-[680px] w-full px-4 pt-10 md:px-0 space-y-10'>
            {chats[currentChatId]?.messages.map((message) => (
              <div key={message.id} className='w-full'>
                
                {message.role === 'user' ? (
                  // User Message Block
                  <div className='flex justify-end'>
                    <div className='max-w-[85%] rounded-2xl rounded-tr-sm bg-[#161926] border border-[#20213a] px-5 py-3 text-[15px] leading-relaxed text-[#e8e8f0]'>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ) : (
                  // AI Answer Block
                  <div className='w-full'>
                    <div className='mb-3 flex items-center gap-2'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#161926]'>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e8e8f0]"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
                      </div>
                      <span className='text-base font-semibold text-[#e8e8f0]'>Answer</span>
                    </div>
                    
                    <div className='text-[15px] leading-relaxed text-[#e8e8f0] pl-8'>
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className='mb-4 last:mb-0'>{children}</p>,
                          ul: ({ children }) => <ul className='mb-4 list-disc pl-5 space-y-1 text-[#e8e8f0]/90'>{children}</ul>,
                          ol: ({ children }) => <ol className='mb-4 list-decimal pl-5 space-y-1 text-[#e8e8f0]/90'>{children}</ol>,
                          code: ({ children }) => <code className='rounded bg-[#20213a] px-1.5 py-0.5 font-mono text-sm text-[#5b5bd6]'>{children}</code>,
                          pre: ({ children }) => <pre className='mb-4 overflow-x-auto rounded-xl border border-[#20213a] bg-[#11131d] p-4 text-sm'>{children}</pre>,
                          h1: ({ children }) => <h1 className='mb-3 mt-6 text-xl font-bold text-white'>{children}</h1>,
                          h2: ({ children }) => <h2 className='mb-3 mt-6 text-lg font-bold text-white'>{children}</h2>,
                          h3: ({ children }) => <h3 className='mb-2 mt-5 text-base font-bold text-white'>{children}</h3>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>

                      {/* Mocked Action Row */}
                      <div className='mt-5 flex items-center gap-3'>
                        <button className='flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e8a] hover:bg-[#161926] hover:text-[#e8e8f0] transition-colors'>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                        <button className='flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e8a] hover:bg-[#161926] hover:text-[#e8e8f0] transition-colors'>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                        </button>
                        <button className='flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e8a] hover:bg-[#161926] hover:text-[#e8e8f0] transition-colors'>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Input Area */}
        <footer className='absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0d0f17] via-[#0d0f17] to-transparent pt-16 pb-6'>
          <div className='mx-auto w-full max-w-[680px] px-4 md:px-0'>
            <form 
              onSubmit={handleSubmitMessage} 
              className='relative flex flex-col w-full rounded-[1.25rem] border border-[#20213a] bg-[#161926] p-3 shadow-2xl transition-all focus-within:border-[#5b5bd6]/80 focus-within:ring-1 focus-within:ring-[#5b5bd6]/50'
            >
              <textarea
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitMessage(e);
                  }
                }}
                placeholder='Ask anything...'
                className='max-h-32 min-h-[44px] w-full resize-none bg-transparent px-1 py-2 text-[15px] text-[#e8e8f0] outline-none placeholder:text-[#6e6e8a]'
                rows={1}
              />
              
              {/* Toolbar Row */}
              <div className='mt-2 flex items-center justify-between border-t border-[#20213a]/50 pt-2'>
                <div className='flex items-center gap-1'>
                  <button type="button" className='flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[#6e6e8a] transition-colors hover:bg-[#20213a] hover:text-[#e8e8f0]'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>
                    Focus
                  </button>
                  <button type="button" className='flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[#6e6e8a] transition-colors hover:bg-[#20213a] hover:text-[#e8e8f0]'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                    Attach
                  </button>
                </div>
                
                <button
                  type='submit'
                  disabled={!chatInput.trim()}
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-[#5b5bd6] text-white shadow-sm transition-all hover:bg-[#5b5bd6]/90 disabled:cursor-not-allowed disabled:bg-[#20213a] disabled:text-[#6e6e8a]'
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </form>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default Dashboard