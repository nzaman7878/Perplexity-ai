import { useRef, useState, useEffect } from 'react';

const ChatInput = ({ value, onChange, onSubmit }) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);


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
        
        onChange({ target: { value: currentTranscript } });
        
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


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
   
    e.target.value = null;
  };

  const clearImage = () => {
    setSelectedImage(null);
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
      if (value.trim() || selectedImage) {
        onSubmit(e, selectedImage);
        setSelectedImage(null);
        if (isListening) recognitionRef.current.stop();
      }
    }
  };

  return (
    <footer className='absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0d0f17] via-[#0d0f17] to-transparent pt-16 pb-6'>
      <div className='mx-auto w-full max-w-[720px] px-4 md:px-0'>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e, selectedImage);
            setSelectedImage(null);
            if (isListening) recognitionRef.current.stop();
          }} 
          className='relative flex flex-col w-full rounded-2xl border border-[#20213a] bg-[#161926]/90 backdrop-blur-md p-3 shadow-2xl transition-all focus-within:border-[#5b5bd6]/80 focus-within:ring-1 focus-within:ring-[#5b5bd6]/50'
        >
          
         
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/webp"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
          />

       
          {selectedImage && (
            <div className="relative mb-3 ml-2 mt-2 inline-block h-20 w-20 rounded-xl border border-[#20213a] bg-[#11131d] p-1">
              <img 
                src={selectedImage} 
                alt="Upload preview" 
                className="h-full w-full rounded-lg object-cover" 
              />
              <button 
                type="button" 
                onClick={clearImage}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#20213a] text-xs text-[#e8e8f0] hover:bg-red-500 hover:text-white transition-colors"
                title="Remove image"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          )}

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
              
              
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className='flex items-center justify-center rounded-full h-8 w-8 text-[#6e6e8a] hover:bg-[#20213a] hover:text-[#e8e8f0] transition-colors' 
                title="Attach File"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              </button>
              
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                )}
              </button>
            </div>
            
            <button
              type='submit'
              disabled={!value.trim() && !selectedImage}
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