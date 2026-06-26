import React from 'react';

const LoadingMessage = () => {
  return (
    <div className='w-full mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      {/* Animated Header */}
      <div className='mb-4 flex items-center gap-3'>
        <div className='relative flex h-6 w-6 items-center justify-center rounded-full bg-[#161926]'>
          {/* Inner spinning ring */}
          <svg className="absolute h-full w-full animate-spin text-[#5b5bd6]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {/* Center dot */}
          <div className="h-1.5 w-1.5 rounded-full bg-[#e8e8f0]"></div>
        </div>
        <span className='text-base font-semibold text-[#e8e8f0] animate-pulse'>
          Searching sources...
        </span>
      </div>
      
      {/* Pulsing Skeleton Lines */}
      <div className='pl-9 space-y-3 w-full max-w-[85%]'>
        <div className='h-3.5 w-full rounded-full bg-[#20213a] animate-pulse'></div>
        <div className='h-3.5 w-11/12 rounded-full bg-[#20213a] animate-pulse delay-75'></div>
        <div className='h-3.5 w-4/5 rounded-full bg-[#20213a] animate-pulse delay-150'></div>
      </div>
    </div>
  );
};

export default LoadingMessage;