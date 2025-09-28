import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, AlertCircle, X, Bot, User } from 'lucide-react';
import { useOpenAI } from '../../hooks/useOpenAI';

const AIAssistantChat = ({ isOpen, onToggle, context = null }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy tu asistente de impuestos del SAT. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const { loading, error, getChatResponse, getStreamingResponse, clearError } = useOpenAI();

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage?.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage?.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Create AI message placeholder
    const aiMessageId = Date.now() + 1;
    const aiMessage = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      // Prepare system message with context
      const systemMessage = context 
        ? `You are a helpful Mexican tax assistant specialized in helping users with SAT refund processes and compliance. Current context: ${JSON.stringify(context)}`
        : 'You are a helpful Mexican tax assistant specialized in helping users with SAT refund processes and compliance.';

      // Use streaming for better UX
      await getStreamingResponse(
        inputMessage?.trim(),
        (chunk) => {
          setMessages(prev => 
            prev?.map(msg => 
              msg?.id === aiMessageId 
                ? { ...msg, content: msg?.content + chunk }
                : msg
            )
          );
        },
        systemMessage
      );

      // Mark streaming as complete
      setMessages(prev => 
        prev?.map(msg => 
          msg?.id === aiMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => 
        prev?.map(msg => 
          msg?.id === aiMessageId 
            ? { 
                ...msg, 
                content: 'Lo siento, ocurrió un error. Por favor, intenta de nuevo.', 
                isStreaming: false,
                isError: true 
              }
            : msg
        )
      );
    }
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-40"
        aria-label="Abrir asistente de IA"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-40">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">Asistente SAT</h3>
        </div>
        <button
          onClick={onToggle}
          className="text-white hover:text-blue-200 transition-colors"
          aria-label="Cerrar chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message?.id}
            className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${message?.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message?.type === 'user' ?'bg-blue-600 text-white' :'bg-gray-100 text-gray-600'
              }`}>
                {message?.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`rounded-lg p-3 ${
                message?.type === 'user' ?'bg-blue-600 text-white'
                  : message?.isError
                    ? 'bg-red-50 text-red-800 border border-red-200' :'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message?.content}</p>
                {message?.isStreaming && (
                  <div className="flex items-center gap-1 mt-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs opacity-70">Escribiendo...</span>
                  </div>
                )}
                <span className="text-xs opacity-70 block mt-1">
                  {formatTime(message?.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 text-sm">
              <p className="text-red-800 font-medium">{error?.error}</p>
              <p className="text-red-600 text-xs mt-1">{error?.suggestion}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e?.target?.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputMessage?.trim() || loading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantChat;