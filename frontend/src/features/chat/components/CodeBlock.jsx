import { useState } from 'react';

const CodeBlock = ({ children }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(children.props.children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mb-4">
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 rounded bg-[#20213a] px-2 py-1 text-xs text-[#6e6e8a] opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className='overflow-x-auto rounded-xl border border-[#20213a] bg-[#11131d] p-4 text-sm'>
        {children}
      </pre>
    </div>
  );
};

export default CodeBlock;