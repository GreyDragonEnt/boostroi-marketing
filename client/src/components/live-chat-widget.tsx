import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      text: "G'day! I'm here to help you boost your ROI. What can I answer for you today?",
      sender: "agent",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-responses for common questions
  const autoResponses: Record<string, string> = {
    "pricing": "Our pricing starts at A$550 for a one-time audit, with monthly plans from A$7,500. Each plan includes different levels of service. Would you like me to schedule a call to discuss what's best for your business?",
    "results": "Our clients typically see 200-900% revenue increases within 90 days. We focus on data-driven strategies that deliver measurable ROI. Want to see some case studies?",
    "services": "We specialize in Social Media Marketing, Content & Influencer Marketing, Conversion Optimization, and Analytics & Tracking. All focused on maximizing your ROI. What area interests you most?",
    "time": "Most clients see improvements within 30 days, with significant ROI gains in 60-90 days. We work fast because we know your time is money!",
    "guarantee": "Yes! We offer a 14-day money-back guarantee on our Starter package. Your success is our reputation.",
    "default": "That's a great question! I'd love to connect you with one of our ROI specialists who can give you a detailed answer. Would you like to book a free 15-minute call?"
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsAgentTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const messageKey = Object.keys(autoResponses).find(key => 
        currentMessage.toLowerCase().includes(key)
      );
      
      const responseText = autoResponses[messageKey || "default"];
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "agent",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsAgentTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-AU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-brand text-white rounded-full w-16 h-16 p-0 shadow-lg hover:bg-brand/90 hover:scale-110 transition-all animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
          !
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-lg shadow-2xl border transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-80 h-96'
      }`}>
        
        {/* Header */}
        <div className="bg-brand text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">BoostROI Support</div>
              <div className="text-xs opacity-90">Typically replies in 2 minutes</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 h-auto bg-transparent hover:bg-white/20"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="p-1 h-auto bg-transparent hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 h-64">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.sender === 'user'
                          ? 'bg-brand text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div>{message.text}</div>
                      <div className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isAgentTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t flex space-x-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about pricing, results, or services..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-brand hover:bg-brand/90 p-2"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}