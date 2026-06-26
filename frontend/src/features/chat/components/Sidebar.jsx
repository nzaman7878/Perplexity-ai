
const Sidebar = ({ chats, currentChatId, onOpenChat, onNewChat }) => (
  <aside className='hidden w-[260px] flex-shrink-0 flex-col border-r border-[#161926] bg-[#11131d] md:flex'>
    <div className='p-4 pb-2'>
      {/* Logo */}
      <h1 className='mb-6 flex items-center gap-2 text-xl font-semibold tracking-tight text-[#e8e8f0]'>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e8e8f0]">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="8" y1="12" x2="16" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="16"></line>
        </svg>
        Perplexity
      </h1>
    
      <button 
        onClick={onNewChat}
        type="button"
        className='mb-4 flex w-full items-center justify-between gap-2 rounded-full border border-[#20213a] bg-transparent px-4 py-2.5 text-sm font-medium text-[#e8e8f0] transition-colors hover:bg-[#161926]'
      >
        <span className='flex items-center gap-2'>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Thread
        </span>
        <span className='text-xs text-[#6e6e8a]'>Ctrl I</span>
      </button>

      <div className="mb-4 flex flex-col gap-1 border-b border-[#161926] pb-4">
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#6e6e8a] hover:bg-[#161926] hover:text-[#e8e8f0] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          Library
        </button>
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#6e6e8a] hover:bg-[#161926] hover:text-[#e8e8f0] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Spaces
        </button>
      </div>
    </div>

    <div className='flex-1 space-y-[2px] overflow-y-auto px-2 pb-4 custom-scrollbar'>
      <p className='px-3 py-2 text-xs font-semibold text-[#6e6e8a] uppercase tracking-wider'>Recent</p>
      {chats && Object.values(chats).map((chatObj) => {
        const isActive = chatObj.id === currentChatId;
        return (
          <button
            onClick={() => onOpenChat(chatObj.id)}
            key={chatObj.id}
            type='button'
            className={`group relative flex w-full cursor-pointer items-center truncate rounded-lg px-3 py-2 text-left text-[14px] font-medium transition-colors ${
              isActive ? 'bg-[#161926] text-[#e8e8f0]' : 'text-[#6e6e8a] hover:bg-[#161926]/50 hover:text-[#e8e8f0]'
            }`}
          >
            {isActive && <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#5b5bd6]" />}
            <span className="truncate">{chatObj.title}</span>
          </button>
        )
      })}
    </div>
  </aside>
);

export default Sidebar;