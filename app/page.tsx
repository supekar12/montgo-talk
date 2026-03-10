"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatDashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am Montgo-Talk, the official AI assistant for the City of Montgomery, AL. I can help you with city services, alerts, contacts, and civic information. How may I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Use environment variable for the backend API URL, fallback to localhost for local testing
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Backend expects 'message' in the body but verify your specific endpoint payload
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to backend");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I am having trouble connecting to the city dashboard right now. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-slate-950 font-sans overflow-hidden text-slate-100">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-5 flex items-center justify-between border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.4)] text-slate-900 font-bold text-2xl tracking-tighter shrink-0 ring-1 ring-amber-300/50">
            M
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10"></div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 drop-shadow-sm">
              Montgo-Talk
            </h1>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-700"></span>
            <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide uppercase">
              Civic Assistant • City of Montgomery, AL
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Online</span>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto overflow-y-auto px-4 py-8 scroll-smooth" ref={scrollRef}>
        <div className="flex flex-col gap-6 justify-end min-h-full pb-4">

          {/* Welcome Message Empty State or Normal Messages */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 my-auto">
              <div className="w-20 h-20 rounded-3xl bg-slate-800/50 flex items-center justify-center border border-white/5 shadow-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-lg font-medium">Start a conversation to get civic assistance.</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full group animate-in slide-in-from-bottom-2 fade-in duration-300 ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div className={`relative flex max-w-[85%] md:max-w-[70%] items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

                {/* Avatar for Assistant */}
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex flex-shrink-0 items-center justify-center text-slate-950 font-bold text-sm ring-2 ring-slate-950 shadow-md transform transition-transform group-hover:scale-105">
                    M
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-lg backdrop-blur-md transition-all ${msg.role === "user"
                    ? "bg-blue-600/90 text-white rounded-br-sm border border-blue-500/50 shadow-blue-900/20"
                    : "bg-slate-800/80 text-slate-200 rounded-bl-sm border border-slate-700/50 shadow-slate-900/50"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex w-full justify-start animate-in fade-in duration-300">
              <div className="relative flex max-w-[85%] items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex flex-shrink-0 items-center justify-center text-slate-950 font-bold text-sm ring-2 ring-slate-950 shadow-md">
                  M
                </div>
                <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl rounded-bl-sm px-5 py-4 shadow-lg flex items-center gap-1.5 h-[52px]">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-[bounce_1s_infinite_-0.3s]"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-[bounce_1s_infinite_-0.15s]"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-[bounce_1s_infinite]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="relative z-20 w-full px-4 py-5 sm:px-6 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={sendMessage} className="relative flex items-center group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 opacity-20 group-hover:opacity-40 transition-opacity blur-md"></div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about garbage collection, permits, alerts..."
              disabled={isLoading}
              className="relative w-full bg-slate-900/90 border border-slate-700 rounded-full pl-6 pr-16 py-4 lg:py-5 text-[15px] sm:text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-inner disabled:bg-slate-900/50 disabled:text-slate-500"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 sm:right-3 top-2 bottom-2 lg:top-2.5 lg:bottom-2.5 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 aspect-square rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] disabled:opacity-40 disabled:hover:from-amber-500 disabled:hover:to-amber-600 disabled:shadow-none hover:scale-105 active:scale-95 group/btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 transform transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-4 text-[11px] sm:text-xs text-slate-500 font-medium tracking-wide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-amber-500/70">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            <span>Powered by <span className="text-slate-400">Gemini AI</span> & <span className="text-slate-400">Bright Data</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
