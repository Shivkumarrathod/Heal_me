'use client'
import React, { useState, useEffect, useRef } from 'react';
import { IoIosSend } from 'react-icons/io';

const AIConsult = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('aiConsultMessages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  useEffect(() => {
    localStorage.setItem('aiConsultMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim() || loading) return;

    const newMessages = [...messages, { type: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    const aiReplyRaw = await getAIReply(newMessages);

    let currentText = '';
    let i = 0;

    const addLetter = () => {
      if (i < aiReplyRaw.length) {
        currentText += aiReplyRaw[i];
        setMessages((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].type === 'ai' && prev[prev.length - 1].typing) {
            const updated = [...prev];
            updated[updated.length - 1] = { type: 'ai', text: currentText, typing: true };
            return updated;
          } else {
            return [...prev, { type: 'ai', text: currentText, typing: true }];
          }
        });
        i++;
        setTimeout(addLetter, 5);
      } else {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'ai', text: currentText, typing: false };
          return updated;
        });
        setLoading(false);
      }
    };

    addLetter();
  };

  async function getAIReply(allMessages) {
    const apiKey = 'AIzaSyAbuuBezNjy6BVNBcMJqJbxZR0MvfDUvNo';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const contextMessages = allMessages
      .slice(-10) // Last 10 messages (5 user/AI turns)
      .map((msg) => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.text}`)
      .join('\n');

    const prompt = `
      You are a helpful and concise AI healthcare assistant. Use the previous conversation for context and continuity.

      - Provide clear, relevant, and empathetic responses.
      - For simple or brief user inputs (e.g., greetings, small talk), respond briefly without adding any disclaimers.
      - For medical or health-related questions, respond with up to 15 short sentences, using bullet points for advice and numbered lists for steps or precautions.
      - Always end health-related responses with:
        "Note: This AI does not replace professional medical advice."

      Previous conversation:
      ${contextMessages}

      User: ${userInput}

      AI:
    `;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      let aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
      aiText = aiText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
      const lines = aiText.split(/\r?\n/).filter(Boolean);
      return lines.slice(0, 30).join('\n');
    } catch (error) {
      console.error('Error fetching from Gemini:', error);
      return 'Failed to get response from AI.';
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen items-center relative">
      <div
        className="p-6 space-y-4 overflow-y-auto"
        style={{
          height: '80%',
          width: '60%',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE 10+
        }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
            <div className="bg-purple-100 text-purple-900 rounded-xl p-6 shadow text-center max-w-md w-full">
              <h3 className="font-semibold mb-2 text-lg">How do you search?</h3>
              <p className="text-sm">Type your health-related query and hit send. The AI provides insights or next steps.</p>
            </div>
            <div className="bg-purple-100 text-purple-900 rounded-xl p-6 shadow text-center max-w-md w-full">
              <h3 className="font-semibold mb-2 text-lg">What can you ask?</h3>
              <p className="text-sm">Ask about symptoms, causes, medications, treatments, mental health tips, or diet plans.</p>
            </div>
            <div className="bg-purple-100 text-purple-900 rounded-xl p-6 shadow text-center max-w-md w-full">
              <h3 className="font-semibold mb-2 text-lg">Stay Curious</h3>
              <p className="text-sm">Take charge of your health with knowledge. One question can start the journey.</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-4 rounded-xl shadow break-words whitespace-pre-wrap ${
                    msg.type === 'user'
                      ? 'bg-purple-600 text-white text-right'
                      : 'bg-purple-100 text-purple-900 text-left'
                  }`}
                  style={{ maxWidth: '100%', width: 'auto', display: 'inline-block' }}
                >
                  {msg.type === 'ai' && msg.typing ? (
                    <>
                      {msg.text}
                      <em style={{ marginLeft: '8px', fontStyle: 'normal', color: '#6B46C1' }}>
                        AI is typing...
                      </em>
                    </>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="h-[20%] flex justify-center items-center w-full">
        <div className="relative w-1/2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask your AI health consultant..."
            className="w-full bg-purple-50 border border-purple-300 rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring focus:border-purple-500 placeholder-purple-400 text-purple-900"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            <IoIosSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConsult;
