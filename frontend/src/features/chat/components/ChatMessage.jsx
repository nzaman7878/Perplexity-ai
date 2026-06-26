import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '../components/CodeBlock';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className='flex justify-end w-full mb-8'>
        <div className='max-w-[85%] rounded-2xl rounded-tr-sm bg-[#161926] border border-[#20213a] px-5 py-3 text-[15px] leading-relaxed text-[#e8e8f0]'>
          <p>{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full mb-10'>
    
      <div className="mb-4">
        <div className='mb-2 flex items-center gap-2'>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#6e6e8a]"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          <span className='text-base font-semibold text-[#e8e8f0]'>Sources</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {[1, 2, 3].map(num => (
            <div key={num} className="flex min-w-[140px] cursor-pointer items-center gap-2 rounded-lg border border-[#20213a] bg-[#11131d] p-2 hover:bg-[#161926] transition-colors">
              <div className="h-4 w-4 rounded bg-[#20213a] flex items-center justify-center text-[10px]">{num}</div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-[#e8e8f0] truncate w-24">Reference {num}</span>
                <span className="text-[10px] text-[#6e6e8a]">example.com</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mb-3 flex items-center gap-2'>
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#161926]'>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#e8e8f0]"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
        </div>
        <span className='text-base font-semibold text-[#e8e8f0]'>Answer</span>
      </div>
      
     
      <div className='text-[15px] leading-relaxed text-[#e8e8f0] pl-8'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className='mb-4 last:mb-0'>{children}</p>,
            ul: ({ children }) => <ul className='mb-4 list-disc pl-5 space-y-1 text-[#e8e8f0]/90'>{children}</ul>,
            ol: ({ children }) => <ol className='mb-4 list-decimal pl-5 space-y-1 text-[#e8e8f0]/90'>{children}</ol>,
            li: ({ children }) => <li className='pl-1'>{children}</li>,
            code: ({ inline, children }) => inline 
              ? <code className='rounded bg-[#20213a] px-1.5 py-0.5 font-mono text-sm text-[#5b5bd6]'>{children}</code>
              : <code className="font-mono">{children}</code>,
            pre: CodeBlock,
            h1: ({ children }) => <h1 className='mb-3 mt-6 text-xl font-bold text-white'>{children}</h1>,
            h2: ({ children }) => <h2 className='mb-3 mt-6 text-lg font-bold text-white border-b border-[#20213a] pb-2'>{children}</h2>,
            h3: ({ children }) => <h3 className='mb-2 mt-5 text-base font-bold text-white'>{children}</h3>,
            table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-[#20213a] border border-[#20213a] rounded-lg">{children}</table></div>,
            th: ({ children }) => <th className="px-4 py-2 bg-[#11131d] text-left text-xs font-medium text-[#6e6e8a] uppercase">{children}</th>,
            td: ({ children }) => <td className="px-4 py-2 text-sm text-[#e8e8f0] border-t border-[#20213a]">{children}</td>,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;