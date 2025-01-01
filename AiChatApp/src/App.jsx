import React, { useState } from 'react';
import Groq from 'groq-sdk';
import ReactMarkdown from 'react-markdown';

const apikey = import.meta.env.VITE_GROQ_API_KEY

// Initialize Groq SDK
const groq = new Groq({ apiKey: apikey, dangerouslyAllowBrowser: true });

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(''); // Holds the current AI response while it's being typed

  // Function to handle sending messages
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to chat with the correct role
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
    ]);
    setInput('');
    setLoading(true);

    try {
      // Create the chat completion request with correct message format
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          ...messages.map((msg) => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })),
          { role: 'user', content: input },
        ],
        model: 'llama-3.3-70b-specdec',
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null,
      });

      // Handle response streaming
      let responseText = '';
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || '';
        responseText += content;

        // Update the current response progressively (simulating typing)
        setCurrentResponse((prev) => prev + content);
      }

      // After the response is fully generated, add the AI's complete response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'AI', content: responseText.trim() },
      ]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'AI', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
      setCurrentResponse(''); // Reset the current response after completion
    }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto bg-gray-100 p-6 rounded-lg shadow-lg w-7xl">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-3 border-b">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-100 text-right'
                : 'bg-gray-200 text-left'
            }`}
          >
            <span className="font-bold">{msg.role === 'user' ? 'You: ' : 'AI: '}</span>
            {msg.role === 'AI' ? (
              // Render AI message as Markdown
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            ) : (
              <p>{msg.content}</p>
            )}
          </div>
        ))}
        {loading && (
          <div className="p-3 text-gray-500 italic">
            <span>AI is typing...</span>
          </div>
        )}
        {/* Display the ongoing AI response here */}
        {loading && currentResponse && (
          <div className="p-3 text-gray-500 italic">
            <span>{currentResponse}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatApp;
