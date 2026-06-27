import { useRef, useState, useEffect } from "react";

const LandingView = ({ input, setInput, onSubmit }) => {
  const textareaRef = useRef(null);

  // Voice recognition
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        setInput(transcript);

        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = `${Math.min(
            textareaRef.current.scrollHeight,
            200
          )}px`;
        }
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onerror = (event) => {
        console.error(event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [setInput]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        onSubmit(e);
        if (isListening) recognitionRef.current.stop();
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 pt-4 pb-20">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 flex h-16 w-full items-center justify-center gap-6 px-6 text-sm font-medium text-zinc-400">
        {["Discover", "Finance", "Health", "Academic", "Patents"].map(
          (link) => (
            <button
              key={link}
              className="hover:text-zinc-100 transition-colors"
            >
              {link}
            </button>
          )
        )}
      </nav>

      {/* Heading */}
      <h1 className="mb-10 text-4xl md:text-[42px] font-medium tracking-tight text-[#e8e8f0]">
        perplexity
      </h1>

      {/* Input */}
      <div className="w-full max-w-[720px] rounded-2xl border border-[#20213a] bg-[#161926] shadow-xl transition-all focus-within:border-[#5b5bd6]/80 focus-within:ring-1 focus-within:ring-[#5b5bd6]/50">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type @ for connectors and sources"
          className="w-full resize-none bg-transparent p-4 pb-12 text-[15px] text-[#e8e8f0] outline-none placeholder:text-[#6e6e8a] custom-scrollbar"
          rows={1}
          style={{ minHeight: "120px" }}
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pb-3 -mt-10">
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e8a] hover:bg-[#20213a] hover:text-[#e8e8f0] transition-colors">
              +
            </button>

            <button className="flex items-center gap-1.5 rounded-full bg-[#11131d] px-3 py-1.5 text-xs font-medium text-[#e8e8f0] border border-[#20213a] hover:bg-[#20213a] transition-colors">
              Search
            </button>

            <button className="flex items-center gap-1.5 rounded-full bg-[#11131d] px-3 py-1.5 text-xs font-medium text-[#e8e8f0] border border-[#20213a] hover:bg-[#20213a] transition-colors">
              Computer
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-xs text-[#6e6e8a] hover:text-white">
              Model
            </button>

            {/* Mic Button */}
            <button
              onClick={toggleVoiceInput}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                isListening
                  ? "text-red-500 bg-red-500/10 animate-pulse"
                  : "text-[#6e6e8a] hover:bg-[#20213a] hover:text-white"
              }`}
            >
              {isListening ? "■" : "🎤"}
            </button>

            {/* Submit */}
            <button
              onClick={onSubmit}
              disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8e8f0] text-black transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#20213a] disabled:text-[#6e6e8a]"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-4 grid w-full max-w-[720px] grid-cols-1 gap-3 md:grid-cols-2">
        <div className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#126665] to-[#0f4444] p-4 transition-all hover:brightness-110">
          <h3 className="font-semibold text-white mb-2">Search anything</h3>
          <p className="text-sm text-white/80 pr-4">
            Get fast and accurate answers from trusted sources.
          </p>
        </div>

        <div className="group cursor-pointer rounded-2xl border border-[#20213a] bg-[#11131d] p-4 transition-all hover:border-[#6e6e8a]">
          <h3 className="font-semibold text-white mb-2">
            Get work done with Computer
          </h3>
          <p className="text-sm text-[#6e6e8a] pr-4">
            Hand off projects and get reliable deliverables.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingView;