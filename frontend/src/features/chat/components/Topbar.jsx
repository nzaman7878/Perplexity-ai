import { useState } from 'react';

const Topbar = ({ title }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link", error);
    }
  };

  return (
    <header className='flex h-14 shrink-0 items-center justify-between border-b border-[#161926] px-4 md:px-6 relative'>
      <h2 className='truncate text-sm font-medium text-[#e8e8f0] md:max-w-[400px]'>
        {title || 'New Thread'}
      </h2>
      
      <div className='flex items-center gap-3'>
        <button 
          onClick={handleShare}
          className='flex w-24 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-[#6e6e8a] hover:bg-[#161926] hover:text-[#e8e8f0] transition-colors'
        >
          {isCopied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              Share
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Topbar;