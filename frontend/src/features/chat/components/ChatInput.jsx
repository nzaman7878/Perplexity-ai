import { useRef, useState, useEffect } from 'react';

const ChatInput = ({ value, onChange, onSubmit }) => {
  const textareaRef = useRef(null);
  
  // Voice Recognition States
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; 
      recognition.interimResults = true; 
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        
        // Pass the transcript to the parent component by mimicking an input event
        onChange({ target: { value: currentTranscript } });
        
        // Auto-resize the textarea as speech fills it
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onChange]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support speech recognition. Try Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleInput = (e) => {
    onChange(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(e);
        // Stop listening if they submit the form
        if (isListening) recognitionRef.current.stop();
      }
    }
  };

  return (
    <footer className='absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0d0f17] via-[#0d0f17] to-transparent pt-16 pb-6'>
      <div className='mx-auto w-full max-w-[720px] px-4 md:px-0'>
        <form 
          onSubmit={(e) => {
            onSubmit(e);
            if (isListening) recognitionRef.current.stop();
          }} 
          className='relative flex flex-col w-full rounded-2xl border border-[#20213a] bg-[#161926]/90 backdrop-blur-md p-3 shadow-2xl transition-all focus-within:border-[#5b5bd6]/80 focus-within:ring-1 focus-within:ring-[#5b5bd6]/50'
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder='Ask anything...'
            className='max-h-[200px] min-h-[44px] w-full resize-none bg-transparent px-2 py-2 text-[15px] text-[#e8e8f0] outline-none placeholder:text-[#6e6e8a] custom-scrollbar'
            rows={1}
          />
          
          <div className='mt-2 flex items-center justify-between pt-2'>
            <div className='flex items-center gap-1'>
              <button type="button" className='flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[#e8e8f0] hover:bg-[#20213a] transition-colors'>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
                Focus
              </button>
              <button type="button" className='flex items-center justify-center rounded-full h-8 w-8 text-[#6e6e8a] hover:bg-[#20213a] hover:text-[#e8e8f0] transition-colors' title="Attach File">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              </button>
              
              {/* Updated Voice Button */}
              <button 
                type="button" 
                onClick={toggleVoiceInput}
                className={`flex items-center justify-center rounded-full h-8 w-8 transition-colors ${
                  isListening 
                    ? 'text-red-500 bg-red-500/10 animate-pulse' 
                    : 'text-[#6e6e8a] hover:bg-[#20213a] hover:text-[#e8e8f0]'
                }`} 
                title={isListening ? "Stop Listening" : "Voice Input"}
              >
                {isListening ? (
                  // Stop Square Icon when listening
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
                  </svg>
                ) : (
                  // Mic Icon when not listening
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                )}
              </button>
            </div>
            
            <button
              type='submit'
              disabled={!value.trim()}
              className='flex h-9 w-9 items-center justify-center rounded-full bg-[#5b5bd6] text-white transition-all hover:bg-[#5b5bd6]/90 disabled:cursor-not-allowed disabled:bg-[#20213a] disabled:text-[#6e6e8a]'
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
};

export default ChatInput;