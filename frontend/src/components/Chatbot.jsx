import React, { useMemo, useRef, useState, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { chatbotService } from '../services/chatbotService';

const starterSuggestions = [
  'What career options fit my profile?',
  'Which entrance exams should I consider?',
  'How can I improve my chances for my preferred career?',
  'Can you explain my recommended careers?',
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  const history = useMemo(
    () => messages.filter((message) => message.role === 'user' || message.role === 'assistant').map(({ role, content }) => ({ role, content })),
    [messages]
  );

  const send = async (text) => {
    const message = String(text || '').trim();
    if (!message || loading) return;

    setInput('');
    setError('');
    setMessages((current) => [...current, { role: 'user', content: message }]);
    setLoading(true);

    try {
      const result = await chatbotService.sendMessage(message, history);
      setMessages((current) => [...current, { role: 'assistant', content: result.reply }]);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || 'Something went wrong while getting a response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await send(input);
  };

  const reset = () => {
    setMessages([]);
    setInput('');
    setError('');
  };

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-[80] ${open ? 'pointer-events-none' : ''}`}>
        <span className="chatbot-pulse-ring" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Career Assistant"
          className={`chatbot-launcher w-14 h-14 rounded-full bg-[#27483d] text-white shadow-[0_14px_35px_rgba(39,72,61,0.28)] flex items-center justify-center transition-all hover:-translate-y-1 hover:bg-[#1f3d34] ${open ? 'scale-0 pointer-events-none' : 'scale-100'}`}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        {!open && <span className="chatbot-label">Ask NextStep</span>}
      </div>

      {open && (
        <div className="fixed bottom-6 right-6 z-[70] w-[min(390px,calc(100vw-2rem))] h-[min(640px,calc(100vh-2rem))] bg-[#fffdf8] border border-[#d8dfd7] rounded-3xl shadow-[0_24px_70px_rgba(30,48,40,0.24)] overflow-hidden flex flex-col">
          <div className="bg-[#27483d] text-white px-4 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#e8b95a] text-[#27483d] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold truncate">Career Assistant</h2>
                <p className="text-[11px] text-white/70">Ask anything about your career journey</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                aria-label="Clear chat"
                title="Clear chat"
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Career Assistant"
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f7f8f4]">
            {!messages.length && (
              <div className="space-y-4">
                <div className="bg-white border border-[#e1e7df] rounded-2xl p-4">
                  <p className="text-sm text-[#27483d] leading-relaxed">
                    Ask me about careers, courses, colleges, entrance exams, eligibility, study locations, budgets, skills, or your personalized recommendations.
                  </p>
                </div>
                <div className="space-y-2">
                  {starterSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => send(suggestion)}
                      className="w-full text-left px-3.5 py-3 rounded-xl bg-white border border-[#e1e7df] text-xs font-medium text-slate-700 hover:border-[#8fb39b] hover:bg-[#f2f7f2] transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-xs leading-relaxed whitespace-pre-wrap ${message.role === 'user'
                    ? 'bg-[#32755c] text-white rounded-br-md'
                    : 'bg-white border border-[#e1e7df] text-slate-700 rounded-bl-md'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#e1e7df] rounded-2xl rounded-bl-md px-3.5 py-3 text-xs text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}

            {error && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3 text-xs leading-relaxed">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-[#e1e7df] bg-white shrink-0">
            <div className="flex items-end gap-2 rounded-2xl border border-[#d8dfd7] bg-[#fbfcf9] p-2 focus-within:border-[#6ea084]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={2}
                placeholder="Ask a question..."
                className="flex-1 resize-none bg-transparent px-2 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-[#27483d] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 px-1">AI-generated guidance can be imperfect. Verify institution-specific admission details from official sources.</p>
          </form>
        </div>
      )}
    </>
  );
}
