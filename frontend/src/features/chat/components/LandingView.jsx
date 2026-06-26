import { useRef } from 'react';

const LandingView = ({ input, setInput, onSubmit }) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) onSubmit(e);
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 pt-4 pb-20">
      
    
      <nav className="absolute top-0 left-0 flex h-16 w-full items-center justify-center gap-6 px-6 text-sm font-medium text-zinc-400">
        {['Discover', 'Finance', 'Health', 'Academic', 'Patents'].map((link) => (
          <button key={link} className="hover:text-zinc-100 transition-colors">
            {link}
          </button>
        ))}
      </nav>

     
      <h1 className="mb-10 text-4xl md:text-[42px] font-medium tracking-tight text-[#e8e8f0]">
        perplexity
      </h1>

     
      <div className="w-full max-w-[720px] rounded-2xl border border-[#20213a] bg-[#161926] shadow-xl transition-all focus-within:border-[#5b5bd6]/80 focus-within:ring-1 focus-within:ring-[#5b5bd6]/50">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type @ for connectors and sources"
          className="w-full resize-none bg-transparent p-4 pb-12 text-[15px] text-[#e8e8f0] outline-none placeholder:text-[#6e6e8a] custom-scrollbar"
          rows={1}
          style={{ minHeight: '120px' }}
        />
        
        {/* Input Toolbar */}
        <div className="flex items-center justify-between px-3 pb-3 -mt-10">
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e8a] hover:bg-[#20213a] hover:text-[#e8e8f0] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-[#11131d] px-3 py-1.5 text-xs font-medium text-[#e8e8f0] border border-[#20213a] hover:bg-[#20213a] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Search
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1 opacity-60"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-[#11131d] px-3 py-1.5 text-xs font-medium text-[#e8e8f0] border border-[#20213a] hover:bg-[#20213a] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              Computer
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-[#6e6e8a] hover:text-[#e8e8f0] transition-colors">
              Model
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e8a] hover:bg-[#20213a] hover:text-[#e8e8f0] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            </button>
            <button
              onClick={onSubmit}
              disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e8f0] text-[#0d0f17] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#20213a] disabled:text-[#6e6e8a]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                <rect x="3" y="8" width="4" height="8" rx="1"></rect>
                <rect x="10" y="4" width="4" height="16" rx="1"></rect>
                <rect x="17" y="9" width="4" height="6" rx="1"></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>

      
      <div className="mt-4 grid w-full max-w-[720px] grid-cols-1 gap-3 md:grid-cols-2">
        <div className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#126665] to-[#0f4444] p-4 transition-all hover:brightness-110">
          <div className="mb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <h3 className="font-semibold text-white">Search anything</h3>
          </div>
          <p className="text-sm text-white/80 pr-4">
            Get fast and accurate answers from the most trusted sources.
          </p>
        </div>

        <div className="group cursor-pointer rounded-2xl border border-[#20213a] bg-[#11131d] p-4 transition-all hover:border-[#6e6e8a]">
          <div className="mb-2 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <h3 className="font-semibold text-white">Get work done with Computer</h3>
            <span className="rounded bg-teal-900/50 px-1.5 py-0.5 text-[10px] font-bold text-teal-400">NEW</span>
          </div>
          <p className="text-sm text-[#6e6e8a] pr-4">
            Hand off your projects to get polished, reliable deliverables around the clock.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingView;