"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://magnot-talk1.vercel.app";
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const commonRequests = [
    {
      title: "Find nearest Police/Fire Station",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#DEAC35] shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      query: "Where is the nearest police or fire station?",
    },
    {
      title: "Report a Pothole (311 Service)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#DEAC35] shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
        </svg>
      ),
      query: "How do I report a pothole?",
    },
    {
      title: "Check Garbage Pickup",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#DEAC35] shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      ),
      query: "When is my garbage pickup?",
    }
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#f4f7fa] font-sans text-gray-800">

      {/* Header */}
      <header className="w-full px-4 py-3 sm:py-4 flex items-center justify-between bg-[#003366] text-white shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3 max-w-4xl mx-auto w-full">
          <div className="w-12 h-12 rounded-[14px] bg-[#eab308] flex items-center justify-center shrink-0 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[26px] h-[26px] text-[#003366] shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
          </div>
          <div className="flex flex-col flex-1">
            <h1 className="text-[20px] sm:text-[22px] font-bold leading-tight tracking-tight m-0">Montgo-Talk</h1>
            <p className="text-[14px] text-blue-200 mt-0.5 m-0">Civic Assistant</p>
          </div>
          <button className="p-2 text-white hover:bg-[#002244] rounded-lg transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[28px] h-[28px] shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto px-4 py-6 flex flex-col scroll-smooth" ref={scrollRef}>
        <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col">
          {messages.length === 0 ? (
            /* Home View / Empty State */
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* Welcome Card */}
              <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-sm border border-gray-200/60 mt-2">
                <h2 className="text-[26px] sm:text-[32px] font-medium text-[#0A2540] leading-tight mb-4 tracking-tight">
                  Hello, resident! I'm Montgo-Talk. <span className="inline-block origin-bottom-right hover:animate-waving-hand">👋</span>
                </h2>
                <p className="text-[18px] sm:text-[20px] text-[#475569] mb-6 leading-relaxed">
                  How can I help you navigate your city today?
                </p>
                <p className="text-[16px] text-[#64748b]">
                  I answer questions using official City of Montgomery data.
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-[18px] font-medium text-[#475569] mb-4 px-2">Common Requests</h3>
                <div className="flex flex-col gap-4">
                  {commonRequests.map((req, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(req.query)}
                      className="flex items-center gap-5 bg-white p-3.5 sm:p-4 rounded-[20px] shadow-sm border border-gray-200/60 hover:shadow-md transition-shadow active:bg-gray-50 text-left w-full group"
                    >
                      <div className="w-[60px] h-[60px] rounded-[16px] bg-[#002244] text-[#eab308] flex items-center justify-center shrink-0 group-hover:bg-[#003366] transition-colors">
                        {req.icon}
                      </div>
                      <span className="text-[18px] font-medium text-[#0A2540]">{req.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Chat View */
            <div className="flex flex-col gap-6 min-h-full pb-4">

              <button
                onClick={() => setMessages([])}
                className="group flex items-center gap-2 text-[#003366] font-semibold text-[17px] py-2 hover:opacity-80 transition-opacity self-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[20px] h-[20px] shrink-0 group-hover:-translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Home
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-300/60"></div>
                <span className="flex-shrink-0 mx-4 text-[#94a3b8] font-medium text-[15px]">Today</span>
                <div className="flex-grow border-t border-gray-300/60"></div>
              </div>

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
                >
                  <div className={`flex max-w-[90%] sm:max-w-[75%] gap-3 items-start ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

                    {/* Avatar User */}
                    {msg.role === "user" && (
                      <div className="w-[42px] h-[42px] rounded-full bg-[#003366] flex shrink-0 items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[22px] h-[22px] text-white shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                    )}

                    {/* Avatar Assistant */}
                    {msg.role === "assistant" && (
                      <div className="w-[42px] h-[42px] rounded-full bg-[#eab308] flex shrink-0 items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[24px] h-[24px] text-[#003366] shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                        </svg>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                      className={`px-5 py-4 rounded-[20px] text-[17px] sm:text-[18px] leading-relaxed shadow-sm ${msg.role === "user"
                        ? "bg-[#003366] text-white rounded-tr-sm"
                        : "bg-white text-[#1e293b] border border-gray-200/60 rounded-tl-sm"
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
                  <div className="flex max-w-[85%] gap-3 items-start">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#eab308] flex shrink-0 items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[24px] h-[24px] text-[#003366] shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                      </svg>
                    </div>
                    <div className="bg-white border border-gray-200/60 rounded-[20px] rounded-tl-sm px-6 py-5 shadow-sm flex items-center gap-2 h-[60px]">
                      <div className="w-3 h-3 bg-[#cbd5e1] rounded-full animate-[bounce_1s_infinite_-0.3s]"></div>
                      <div className="w-3 h-3 bg-[#cbd5e1] rounded-full animate-[bounce_1s_infinite_-0.15s]"></div>
                      <div className="w-3 h-3 bg-[#cbd5e1] rounded-full animate-[bounce_1s_infinite]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="w-full px-4 py-4 sm:px-6 bg-white border-t border-gray-200/60 z-20 shrink-0 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)] pb-6 pt-5">
        <div className="max-w-3xl mx-auto flex items-end gap-3">

          <div className="relative flex-1">
            <form onSubmit={onSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about city services, sanitat..."
                disabled={isLoading}
                className="w-full bg-[#f4f7fa] border border-gray-200/80 rounded-[24px] pl-6 pr-4 py-[18px] text-[17px] text-gray-800 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#7ba4c9] focus:bg-white transition-all disabled:bg-gray-100 disabled:text-gray-500 shadow-inner"
              />
            </form>
          </div>

          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className="w-[62px] h-[62px] shrink-0 bg-[#7ba4c9] hover:bg-[#6893ba] active:bg-[#5b87ac] text-white rounded-[20px] flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="w-[30px] h-[30px] shrink-0 -ml-1 -mt-0.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>

        </div>
      </footer>

    </div>
  );
}
