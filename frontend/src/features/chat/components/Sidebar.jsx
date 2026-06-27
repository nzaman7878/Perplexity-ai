import { useState, useRef, useEffect } from 'react';

const Sidebar = ({ 
  chats, 
  currentChatId, 
  onOpenChat, 
  onNewChat,
  onDeleteChat, 
  user, 
  onLogout 
}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredChats = chats 
    ? Object.values(chats).filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <aside className='hidden w-[260px] flex-shrink-0 flex-col border-r border-[#161926] bg-[#11131d] md:flex'>
      {/* Top Section */}
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

      <div className='flex-1 flex flex-col overflow-hidden'>
        
        <div className="px-4 pb-2">
          <div className="relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e8a]">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#20213a] bg-[#161926] py-1.5 pl-9 pr-3 text-sm text-[#e8e8f0] placeholder:text-[#6e6e8a] focus:border-[#5b5bd6] focus:outline-none focus:ring-1 focus:ring-[#5b5bd6]/50 transition-all"
            />
          </div>
        </div>

        <div className='flex-1 space-y-[2px] overflow-y-auto px-2 pb-4 custom-scrollbar'>
          <p className='px-3 py-2 text-xs font-semibold text-[#6e6e8a] uppercase tracking-wider'>
            {searchQuery ? 'Search Results' : 'Recent'}
          </p>
          
          {filteredChats.length > 0 ? (
            filteredChats.map((chatObj) => {
              const isActive = chatObj.id === currentChatId;
              return (
                <div 
                  key={chatObj.id}
                  className={`group relative flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                    isActive ? 'bg-[#161926] text-[#e8e8f0]' : 'text-[#6e6e8a] hover:bg-[#161926]/50 hover:text-[#e8e8f0]'
                  }`}
                  onClick={() => onOpenChat(chatObj.id)} // Open chat on row click
                >
                  {isActive && <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#5b5bd6]" />}
                  
                  <span className="truncate pr-2 text-[14px] font-medium">{chatObj.title}</span>
                  
                 
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      onDeleteChat(chatObj.id);
                    }}
                    className="flex shrink-0 items-center justify-center p-1 text-[#6e6e8a] opacity-0 transition-all hover:text-red-400 group-hover:opacity-100"
                    title="Delete Thread"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              )
            })
          ) : (
            <p className="px-3 py-2 text-xs text-[#6e6e8a] italic">No threads found.</p>
          )}
        </div>
      </div>

      <div className="relative border-t border-[#161926] p-3" ref={menuRef}>
        
        {isMenuOpen && (
          <div className="absolute bottom-full left-3 mb-2 w-[calc(100%-24px)] rounded-xl border border-[#20213a] bg-[#11131d] shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-150">
            <div className="px-4 py-3 border-b border-[#20213a]">
              <p className="text-sm font-medium text-[#e8e8f0] truncate">
                {user?.username || 'Loading...'}
              </p>
              <p className="text-xs text-[#6e6e8a] truncate mt-0.5">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <div className="p-1">
              <button 
                onClick={onLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#e8e8f0] hover:bg-[#161926] hover:text-red-400 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Log out
              </button>
            </div>
          </div>
        )}

        {/* User Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#161926]"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#5b5bd6] to-purple-400 text-sm font-bold text-white shadow-sm">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col items-start overflow-hidden text-left">
            <span className="w-full truncate text-sm font-medium text-[#e8e8f0]">
              {user?.username || 'Guest'}
            </span>
            <span className="w-full truncate text-[11px] text-[#6e6e8a]">
              {user?.email ? 'Pro Account' : 'Sign in'}
            </span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-[#6e6e8a]">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;