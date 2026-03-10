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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#DEAC35]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      query: "Where is the nearest police or fire station?",
    },
    {
      title: "Report a Pothole (311 Service)",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#DEAC35]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
        </svg>
      ),
      query: "How do I report a pothole?",
    },
    {
      title: "Check Garbage Pickup",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#DEAC35]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      ),
      query: "When is my garbage pickup?",
    }
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8f9fa] font-sans text-gray-800">

      {/* Header */}
      <header className="w-full px-4 py-3 flex items-center justify-between bg-[#003366] text-white shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#DEAC35] flex items-center justify-center shrink-0 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-[#003366]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[20px] font-bold leading-tight tracking-tight">Montgo-Talk</h1>
            <p className="text-[13px] text-blue-200 font-medium">Civic Assistant</p>
          </div>
        </div>

        <button className="p-2 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto px-4 py-5 flex flex-col scroll-smooth" ref={scrollRef}>

        {messages.length === 0 ? (
          /* Home View / Empty State */
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Welcome Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-2">
              <h2 className="text-[24px] font-medium text-[#0A2540] leading-tight mb-4">
                Hello, resident! I'm Montgo-Talk. <span className="inline-block origin-bottom-right hover:animate-waving-hand">👋</span>
              </h2>
              <p className="text-[17px] text-[#334b61] mb-5 leading-relaxed">
                How can I help you navigate your city today?
              </p>
              <p className="text-[15px] text-[#5a768f]">
                I answer questions using official City of Montgomery data.
              </p>
            </div>

            <div className="mt-2">
              <h3 className="text-[17px] font-medium text-[#4a6b8c] mb-3 px-1">Common Requests</h3>
              <div className="flex flex-col gap-3">
                {commonRequests.map((req, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(req.query)}
                    className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow active:bg-gray-50 text-left w-full group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#002244] text-[#DEAC35] flex items-center justify-center shrink-0 group-hover:bg-[#003366] transition-colors">
                      {req.icon}
                    </div>
                    <span className="text-[17px] font-medium text-[#0A2540]">{req.title}</span>
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
              className="group flex items-center gap-2 text-[#003366] font-semibold text-[16px] py-1 hover:opacity-80 transition-opacity self-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Today</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
              >
                <div className={`flex max-w-[85%] sm:max-w-[75%] gap-2 items-start ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

                  {/* Avatar User */}
                  {msg.role === "user" && (
                    <div className="w-10 h-10 rounded-full bg-[#003366] flex shrink-0 items-center justify-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                  )}

                  {/* Avatar Assistant */}
                  {msg.role === "assistant" && (
                    <div className="w-10 h-10 rounded-full bg-[#DEAC35] flex shrink-0 items-center justify-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#003366]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                      </svg>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`px-5 py-4 rounded-[20px] text-[16px] leading-relaxed shadow-sm ${msg.role === "user"
                        ? "bg-[#003366] text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
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
                <div className="flex max-w-[85%] gap-2 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#DEAC35] flex shrink-0 items-center justify-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#003366]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-[20px] rounded-tl-sm px-5 py-5 shadow-sm flex items-center gap-1.5 h-[56px] mt-0.5">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite_-0.3s]"></div>
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite_-0.15s]"></div>
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="w-full px-3 py-3 sm:px-4 bg-white border-t border-gray-100 z-20 shrink-0 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.03)] pb-6 pt-4">
        <div className="max-w-2xl mx-auto flex items-end gap-2">

          <div className="relative flex-1">
            <form onSubmit={onSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about city services, sanitat..."
                disabled={isLoading}
                className="w-full bg-[#f4f7f6] border border-gray-200 rounded-2xl pl-5 pr-4 py-4 text-[16px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
              />
            </form>
          </div>

          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className="w-[56px] h-[56px] shrink-0 bg-[#7a9bb7] hover:bg-[#6888a3] active:bg-[#5b7891] text-white rounded-[18px] flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[26px] h-[26px] -ml-0.5 -mt-0.5 transform rotate-0 opacity-90">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>

        </div>
      </footer>

    </div>
  );
}
