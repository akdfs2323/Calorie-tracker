'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User as UserIcon, ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getCurrentUser, getChatHistory, saveChatMessage } from '@/lib/supabase';
import { ChatMessage } from '@/types';

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadChatHistory(currentUser.id);
  };

  const loadChatHistory = async (userId: string) => {
    const { data } = await getChatHistory(userId, 20);
    if (data) {
      setMessages(data);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || !user || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to UI
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Save user message
    await saveChatMessage({
      user_id: user.id,
      role: 'user',
      content: userMessage,
    });

    try {
      // Get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user_id: user.id,
          role: 'assistant',
          content: data.response,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Save AI message
        await saveChatMessage({
          user_id: user.id,
          role: 'assistant',
          content: data.response,
        });
      } else {
        alert(data.error || 'เกิดข้อผิดพลาดในการสนทนา');
      }
    } catch (error) {
      console.error('Error in chat:', error);
      alert('เกิดข้อผิดพลาดในการสนทนา');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'แนะนำอาหารโปรตีนสูงหน่อย',
    'ควรกินแคลอรี่เท่าไหร่ต่อวัน',
    'วิธีลดน้ำหนักอย่างมีสุขภาพดี',
    'ออกกำลังกายอย่างไรดี',
  ];

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <div className="pt-24 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/80"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="font-display text-3xl font-bold">AI ที่ปรึกษา</h1>
            <p className="text-gray-600">ปรึกษาเรื่องโภชนาการและการออกกำลังกาย</p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="card h-[calc(100vh-280px)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">สวัสดีครับ! 👋</h3>
                <p className="text-gray-600 mb-6">มีอะไรให้ผมช่วยไหมครับ?</p>
                
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="glass p-3 rounded-xl text-sm text-left hover:bg-white/80 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary-400 to-primary-600'
                      : 'bg-gradient-to-br from-accent-400 to-accent-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <UserIcon className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                      : 'glass text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="glass p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-accent-600 animate-spin" />
                    <span className="text-gray-600">กำลังคิด...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200/50 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="พิมพ์ข้อความ..."
                className="flex-1 input-field"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
