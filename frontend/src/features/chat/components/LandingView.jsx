import { useRef, useState, useEffect } from "react";

const LandingView = ({ input, setInput, onSubmit }) => {
  const textareaRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
            200,
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
    setInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() || selectedImage) {
        onSubmit(e, selectedImage);
        setSelectedImage(null);
        if (isListening) recognitionRef.current.stop();

        if (textareaRef.current) textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() || selectedImage) {
      onSubmit(e, selectedImage);
      setSelectedImage(null);
      if (isListening) recognitionRef.current.stop();

      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 pt-4 pb-20">
      <nav className="absolute top-0 left-0 flex h-16 w-full items-center justify-center gap-6 px-6 text-sm font-medium text-zinc-400">
        {["Discover", "Finance", "Health", "Academic", "Patents"].map(
          (link) => (
            <button
              key={link}
              className="hover:text-zinc-100 transition-colors"
            >
              {link}
            </button>
          ),
        )}
      </nav>

      <h1 className="mb-10 text-4xl md:text-[42px] font-medium tracking-tight text-[#ececf1]">
        perplexity
      </h1>

      <form
        onSubmit={handleSubmit}
        className="relative flex w-full max-w-[720px] flex-col rounded-2xl border border-[#2e2f38] bg-[#1b1c21] shadow-md transition-colors focus-within:border-[#4b4c56]"
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedImage && (
          <div className="relative mb-1 ml-4 mt-4 inline-block h-16 w-16 rounded-lg border border-[#2e2f38] bg-[#111216] p-1">
            <img
              src={selectedImage}
              alt="Upload preview"
              className="h-full w-full rounded-md object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#3f404a] text-xs text-[#e8e8f0] hover:bg-red-500 hover:text-white transition-colors shadow-sm"
              title="Remove image"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="w-full resize-none bg-transparent p-4 pb-12 text-[15px] text-[#ececf1] outline-none placeholder:text-[#8e8ea0] custom-scrollbar"
          rows={1}
          style={{ minHeight: selectedImage ? "80px" : "120px" }}
        />

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center justify-center rounded-full h-8 w-8 text-[#6e6e8a] hover:bg-[#2b2c31] hover:text-[#e8e8f0] transition-colors"
              title="Attach File"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>

            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`flex items-center justify-center rounded-full h-8 w-8 transition-colors ${
                isListening
                  ? "text-red-500 bg-red-500/10 animate-pulse"
                  : "text-[#6e6e8a] hover:bg-[#2b2c31] hover:text-[#e8e8f0]"
              }`}
              title={isListening ? "Stop Listening" : "Voice Input"}
            >
              {isListening ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={!input.trim() && !selectedImage}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#30313a] text-[#8e8ea0] transition-all hover:bg-[#3f404a] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </form>

      {/* Cards */}
      <div className="mt-4 grid w-full max-w-[720px] grid-cols-1 gap-3 md:grid-cols-2">
        <div className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#126665] to-[#0f4444] p-4 transition-all hover:brightness-110">
          <h3 className="font-semibold text-white mb-2">Search anything</h3>
          <p className="text-sm text-white/80 pr-4">
            Get fast and accurate answers from trusted sources.
          </p>
        </div>

        <div className="group cursor-pointer rounded-2xl border border-[#2e2f38] bg-[#1b1c21] p-4 transition-all hover:border-[#4b4c56]">
          <h3 className="font-semibold text-[#ececf1] mb-2">
            Organize your knowledge
          </h3>
          <p className="text-sm text-[#8e8ea0] pr-4">
            Create collections to keep your research structured.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
