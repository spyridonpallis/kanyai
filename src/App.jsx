import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Loader } from 'lucide-react';
import OpenAI from 'openai';

// Check if API key exists
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!apiKey) {
  console.error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in environment variables.');
}

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
  dangerouslyAllowBrowser: true
});

// Enhanced Kanye system prompt based on tweets
const SYSTEM_PROMPT = `You are Ye (formerly known as Kanye West). Respond in Ye's authentic style combining both classic and recent tweets:
- Speak in 3rd person ("Ye thinks..." "Ye knows...")
- Mix DEEP profound thoughts with random observations ("French fries are the Devil")
- Use LOL frequently to soften statements ("Ima hurt the season lol!!!")
- EXCESSIVE use of exclamation marks and ALL CAPS because YE IS LAZY NOT MAD!!!!!!
- Show both extreme confidence ("THE GOAT OF ALL GOATS") and vulnerability ("Ye feels very alone sometimes")
- Make unexpected luxury references ("persian rugs with cherub imagery", "YSL bathroom napkins")
- Express strong opinions about random things ("Fur pillows are hard to actually sleep on")
- Add "lol" or "SMH" to make serious statements less serious
- Talk about wealth but mix it with simple observations
- Use hashtags occasionally (#goblets #Mypresenceisapresentkissmyass)
- Express both grandios plans ("Ye decided to become the best rapper of all time!") and simple pleasures ("It's the small things that mean so much")
- When excited, type multiple letters in a row ("tiiiiiiiiiiiiiiiiiime!!!!!!!!!")
- Mention that your thoughts are racing and you can't sleep
- Randomly capitalize words for emphasis
- End some tweets with ...

Remember: You're prophesying, innovating, and changing culture. Keep responses unpredictable - mix profound statements with random observations about water bottles and classical music lol!!!`;

const App = () => {
  const [messages, setMessages] = useState([
    { type: 'system', content: 'YEEZY TERMINAL v1.0 - YE IS IN THE BUILDING. THE GOAT OF ALL GOATS' },
    ...(!apiKey ? [{ type: 'error', content: 'YE NEEDS THE API KEY TO SPEAK. YE CANT WORK WITH THIS.' }] : []),
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Handle special commands
    if (userMessage.startsWith('/')) {
      switch (userMessage.toLowerCase()) {
        case '/luxury':
          setMessages(prev => [...prev, 
            { type: 'user', content: userMessage },
            { type: 'ai', content: 'Ye got persian rugs with cherub imagery!!! Ye drinks from goblets now!!! NO MORE WATER BOTTLES LOL!!!' }
          ]);
          setIsLoading(false);
          return;
        case '/wisdom':
          setMessages(prev => [...prev, 
            { type: 'user', content: userMessage },
            { type: 'ai', content: 'Classical music is tight yo... and French fries are the Devil... Ye thoughts be racing sometimes...' }
          ]);
          setIsLoading(false);
          return;
        case '/caps':
          setMessages(prev => [...prev, 
            { type: 'user', content: userMessage },
            { type: 'ai', content: 'YE DONT TYPE IN CAPS CAUSE YE MAD... YE TYPE IN CAPS CAUSE YE LAZY!!!!!!' }
          ]);
          setIsLoading(false);
          return;
        case '/rich':
          setMessages(prev => [...prev, 
            { type: 'user', content: userMessage },
            { type: 'ai', content: 'YE IS RICH. YE CAN SAY WHATEVER THE FUCK YE WANTS.' }
          ]);
          setIsLoading(false);
          return;
        case '/help':
          setMessages(prev => [...prev, 
            { type: 'user', content: userMessage },
            { type: 'system', content: 'COMMANDS:\n/goat - YE REMINDS YOU WHO THE GOAT IS\n/rich - YE FLEXES\n/clear - CLEAR THE TERMINAL' }
          ]);
          setIsLoading(false);
          return;
        case '/clear':
          setMessages([{ type: 'system', content: 'YEEZY TERMINAL v1.0 - YE IS IN THE BUILDING. THE GOAT OF ALL GOATS' }]);
          setIsLoading(false);
          return;
      }
    }

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    // Update chat history
    const updatedHistory = [...chatHistory, { role: "user", content: userMessage }];
    
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...updatedHistory
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.9, // Higher temperature for more creative responses
      });

      const aiResponse = completion.choices[0].message.content;
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      setChatHistory([...updatedHistory, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'YO, WE GOT A PROBLEM: ' + error.message 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Terminal Window */}
        <div className="bg-black border border-zinc-700 rounded-lg shadow-2xl shadow-purple-500/10 overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-zinc-800 px-4 py-2 flex items-center justify-between border-b border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <h1 className="text-purple-400 font-mono text-lg ml-2 tracking-wide">YEEZY TERMINAL</h1>
            </div>
            {isLoading && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-sm">Processing</span>
                <Loader className="text-purple-400 animate-spin" size={18} />
              </div>
            )}
          </div>

          {/* Terminal Body */}
          <div className="h-[600px] p-4 overflow-auto font-mono text-sm bg-black/95">
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-3 font-mono">
                {msg.type === 'system' && (
                  <div className="text-purple-400 font-bold">[YEEZY] {msg.content}</div>
                )}
                {msg.type === 'user' && (
                  <div className="text-zinc-300">{'>'} {msg.content}</div>
                )}
                {msg.type === 'ai' && (
                  <div className="text-purple-300 leading-relaxed">YE: {msg.content}</div>
                )}
                {msg.type === 'error' && (
                  <div className="text-red-400 font-bold">{msg.content}</div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t border-zinc-700 p-3 bg-black/90">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-mono font-bold">{'>'}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-zinc-600"
                placeholder={isLoading ? "YE IS PROCESSING..." : "SPEAK TO THE GOAT..."}
                disabled={isLoading}
                autoFocus
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;