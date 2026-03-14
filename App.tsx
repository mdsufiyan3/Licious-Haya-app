import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageRole, Product } from './types';
import { ChefHatIcon, FishIcon, SendIcon, SparkleIcon } from './constants';
import { chatWithHaya } from './services/geminiService';

const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-[#E21D24] font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <a 
    href={product.productUrl} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-2xl overflow-hidden group hover:border-[#E21D24] transition-all shadow-md hover:shadow-xl block no-underline"
  >
    <div className="relative h-44 overflow-hidden bg-gray-100">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Licious+Freshness';
        }}
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[#1A1A1A] px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm">
        {product.weight}
      </div>
    </div>
    <div className="p-4 space-y-2">
      <h4 className="text-[15px] font-bold text-[#1A1A1A] line-clamp-1 group-hover:text-[#E21D24] transition-colors">{product.name}</h4>
      <p className="text-[12px] text-gray-500 line-clamp-2 leading-tight h-8">{product.description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-lg font-black text-[#1A1A1A]">{product.price}</span>
        <div className="bg-[#E21D24] text-white text-[10px] font-bold px-5 py-2 rounded-full transition-all shadow-md group-hover:bg-[#C1181E] transform group-active:scale-95 uppercase">
          Add to Cart
        </div>
      </div>
    </div>
  </a>
);

const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="response-content">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <ul key={i} className="list-disc ml-5 my-2">
              <li className="text-gray-700">{parseInline(trimmed.substring(2))}</li>
            </ul>
          );
        }
        if (!trimmed) return <div key={i} className="h-2" />;
        return <p key={i} className="mb-2 text-gray-800 leading-relaxed text-[15px]">{parseInline(line)}</p>;
      })}
    </div>
  );
};

const TypewriterMessage: React.FC<{ content: string, onComplete?: () => void }> = ({ content, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const words = content.split(' ');
  const indexRef = useRef(0);

  useEffect(() => {
    if (indexRef.current >= words.length) return;
    const interval = setInterval(() => {
      if (indexRef.current < words.length) {
        setDisplayedText(prev => {
          const next = words.slice(0, indexRef.current + 1).join(' ');
          indexRef.current++;
          return next;
        });
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 30);
    return () => clearInterval(interval);
  }, [content, onComplete, words.length]);

  return <FormattedMessage content={displayedText} />;
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  const handleSend = async () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: trimmedInput,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === MessageRole.USER ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      
      const response = await chatWithHaya(trimmedInput, history);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: MessageRole.ASSISTANT,
        content: response.text,
        products: response.products || undefined,
        timestamp: Date.now(),
        type: response.products ? 'product' : 'text'
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: MessageRole.ASSISTANT,
        content: "I'm having a bit of trouble connecting to the Licious kitchen. Could you try that again?",
        timestamp: Date.now(),
        type: 'text'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-[#1A1A1A] overflow-hidden relative font-sans">
      <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#FFF5F5] to-white -z-10" />

      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#E21D24] flex items-center justify-center text-white font-black italic shadow-lg shadow-red-200">L</div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Licious Haya</h2>
            <p className="text-xs text-gray-500">AI Assistant</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-[#E21D24] text-white font-medium">
            Chat with Haya
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
            Fresh Products
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
            Recipes
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
            About Licious
          </button>
        </nav>

        <div className="mt-8">
          <button
            onClick={() => {
              // Trigger PWA install
              if ('serviceWorker' in navigator && window.deferredPrompt) {
                window.deferredPrompt.prompt();
                window.deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
                  if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                  }
                  window.deferredPrompt = null;
                });
              }
            }}
            className="w-full bg-[#E21D24] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#C1181E] transition-colors"
          >
            Download App
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative max-w-4xl mx-auto w-full px-4 md:px-6">
        <header className="py-4 flex items-center justify-between border-b border-gray-100 mb-2 bg-white/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E21D24] flex items-center justify-center text-white font-black italic shadow-lg shadow-red-200">L</div>
                <div>
                    <h1 className="text-sm font-bold tracking-tight">Licious Haya</h1>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Freshness Concierge</p>
                </div>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider">Kitchen Live</span>
            </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto pt-2 pb-6 space-y-10 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-10 mt-[-20px] animate-in fade-in duration-700">
              <div className="w-24 h-24 rounded-[32px] bg-white border border-gray-100 flex items-center justify-center shadow-2xl relative">
                <div className="text-[#E21D24] text-6xl font-black italic select-none">H</div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#E21D24] rounded-full flex items-center justify-center border-4 border-white shadow-md">
                   <div className="text-white scale-75"><SparkleIcon /></div>
                </div>
              </div>
              <div className="space-y-3 max-w-sm px-4">
                <p className="text-[#1A1A1A] font-bold text-2xl leading-tight">
                  What's cooking on your <span className="text-[#E21D24]">Licious</span> menu?
                </p>
                <p className="text-gray-500 text-[14px] leading-relaxed">Ask Haya for fresh cuts, cooking tips, or gourmet recipes curated just for you.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-12 pb-24">
                {messages.map((msg, idx) => (
                  <div key={msg.id} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-400`}>
                    <div className={`flex flex-col gap-2 w-full ${msg.role === MessageRole.USER ? 'items-end' : 'items-start'}`}>
                      {msg.role === MessageRole.ASSISTANT && (
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <div className="w-6 h-6 rounded-lg bg-[#E21D24] text-white flex items-center justify-center text-[10px] font-black shadow-sm">H</div>
                          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Haya — Assistant</span>
                        </div>
                      )}
                      <div className={`max-w-[92%] md:max-w-[85%] rounded-[24px] leading-relaxed ${
                        msg.role === MessageRole.USER 
                        ? 'bg-[#E21D24] text-white p-4 shadow-lg' 
                        : 'bg-transparent py-1 px-1 text-[#1A1A1A]'
                      }`}>
                        {msg.role === MessageRole.ASSISTANT ? (
                          idx === messages.length - 1 ? (
                            <TypewriterMessage content={msg.content} onComplete={scrollToBottom} />
                          ) : (
                            <FormattedMessage content={msg.content} />
                          )
                        ) : (
                          <p className="text-[15px] font-medium leading-relaxed">{msg.content}</p>
                        )}
                      </div>
                      {msg.role === MessageRole.ASSISTANT && msg.products && msg.products.length > 0 && (
                        <div className="w-full overflow-x-auto flex gap-4 py-4 px-1 scrollbar-hide animate-in fade-in slide-in-from-right-4 duration-500">
                          {msg.products.map(p => (
                            <ProductCard key={p.id} product={p} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-in fade-in duration-300">
                    <div className="flex flex-col gap-2 w-full items-start">
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <div className="w-6 h-6 rounded-lg bg-[#E21D24] text-white flex items-center justify-center text-[10px] font-black">H</div>
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Haya — Assistant</span>
                      </div>
                      <div className="py-1 px-1">
                         <span className="shimmer-text text-[15px] font-medium italic tracking-wide">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="pb-8 pt-2 bg-white/80 backdrop-blur-xl">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            <button onClick={() => setInputText("Show me fresh chicken breast")} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[12px] font-bold text-gray-600 whitespace-nowrap hover:bg-white hover:border-[#E21D24] hover:text-[#E21D24] transition-all shadow-sm">
              <ChefHatIcon /> Chicken Breast
            </button>
            <button onClick={() => setInputText("Show me some fresh mutton")} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[12px] font-bold text-gray-600 whitespace-nowrap hover:bg-white hover:border-[#E21D24] hover:text-[#E21D24] transition-all shadow-sm">
               Tender Mutton
            </button>
            <button onClick={() => setInputText("Do you have Atlantic salmon?")} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[12px] font-bold text-gray-600 whitespace-nowrap hover:bg-white hover:border-[#E21D24] hover:text-[#E21D24] transition-all shadow-sm">
              <FishIcon /> Atlantic Salmon
            </button>
          </div>
          <div className="bg-[#F9F9F9] rounded-[24px] px-4 py-2.5 border border-gray-200 focus-within:border-[#E21D24] focus-within:bg-white shadow-sm focus-within:shadow-xl transition-all flex items-end gap-2 min-h-[56px] relative">
              <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Haya anything..."
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-[#1A1A1A] placeholder-gray-400 py-2 px-1 resize-none h-[24px] max-h-[160px] overflow-y-auto text-[15px] caret-[#E21D24] scrollbar-hide leading-6"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isLoading}
                  className={`w-10 h-10 rounded-full flex-shrink-0 transition-all flex items-center justify-center mb-0.5 ${
                    inputText.trim() && !isLoading 
                    ? 'bg-[#E21D24] text-white hover:bg-[#C1181E] shadow-lg shadow-red-200' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <SendIcon />
                </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;