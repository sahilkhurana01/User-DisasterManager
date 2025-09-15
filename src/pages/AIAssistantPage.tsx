import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLayout } from '@/components/layout/PageLayout';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI emergency assistant. I'm here to help you with disaster preparedness, safety guidance, and emergency procedures. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate AI response (in real app, this would call /api/ai/chat)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(inputMessage),
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Unable to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const generateMockResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('earthquake')) {
      return "In case of an earthquake: DROP to your hands and knees, take COVER under a desk or table, and HOLD ON until shaking stops. If outdoors, move away from buildings. Stay calm and follow evacuation procedures if necessary.";
    } else if (lowerQuery.includes('flood')) {
      return "For flood safety: Move to higher ground immediately. Never drive through flooded roads. If trapped, call for help and wait for rescue. Keep emergency supplies ready and monitor weather alerts.";
    } else if (lowerQuery.includes('fire')) {
      return "Fire emergency protocol: Call 911 immediately. If possible, use nearest exit and stay low to avoid smoke. Feel doors before opening. If clothes catch fire: Stop, Drop, and Roll. Meet at your designated meeting point.";
    } else if (lowerQuery.includes('shelter') || lowerQuery.includes('safe')) {
      return "Safe shelter locations include reinforced buildings, emergency shelters, and evacuation centers. Avoid windows, use interior rooms on lower floors. Keep emergency kit with water, food, and medical supplies.";
    } else {
      return "I'm here to help with emergency preparedness and safety guidance. Ask me about earthquake safety, flood procedures, fire evacuation, shelter locations, or any other disaster-related concerns.";
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      
      // Simulate voice recognition
      setTimeout(() => {
        setInputMessage("What should I do in an earthquake?");
        setIsListening(false);
        toast({
          title: "Voice Input Complete",
          description: "Message transcribed successfully!"
        });
      }, 2000);
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Speech recognition is not available in this browser.",
        variant: "destructive"
      });
    }
  };

  const quickPrompts = [
    "What should I do in an earthquake?",
    "How to prepare for a flood?",
    "Fire safety procedures",
    "Find nearest shelter",
    "Emergency kit checklist"
  ];

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-11rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 text-center border-b border-white/10 flex-shrink-0"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bot className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold">AI Emergency Assistant</h1>
          </div>
          <Badge variant="outline" className="text-accent border-accent/30">
            Powered by Gemini AI
          </Badge>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card 
                className={`max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-primary/20 border-primary/30' 
                    : 'glass border-white/20'
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <Bot className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className="text-xs text-muted-foreground mt-2 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <Card className="glass border-white/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-accent" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Quick Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4 pb-2 flex-shrink-0"
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(prompt)}
                className="glass border-white/20 whitespace-nowrap text-xs"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 border-t border-white/10 bg-background/50 backdrop-blur-sm flex-shrink-0"
        >
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Ask about emergency procedures, safety tips..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="glass border-white/20 pr-12"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={startVoiceInput}
                disabled={isListening}
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-emergency animate-pulse" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-accent hover:bg-accent/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {isListening && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-emergency text-center mt-2"
            >
              🎤 Listening... Speak your emergency question
            </motion.p>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}