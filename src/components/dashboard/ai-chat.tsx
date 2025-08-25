"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { chat } from "@/ai/flows/chatbot-flow";
import { Bot, Loader, Send, User } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

export default function AiChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const result = await chat({ message: input, leadId: 'lead-test-123' });
            const botMessage: Message = { sender: 'bot', text: result.reply };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chatbot failed:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "The chatbot is currently unavailable.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-[70vh] flex flex-col">
            <CardHeader>
                <CardTitle>AI Customer Assistant</CardTitle>
                <CardDescription>
                    Simulate a conversation with a customer.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && (
                                    <div className="p-2 bg-primary rounded-full text-primary-foreground">
                                        <Bot className="h-6 w-6" />
                                    </div>
                                )}
                                <div className={`rounded-lg px-4 py-2 max-w-[70%] ${msg.sender === 'user' ? 'bg-secondary' : 'bg-card border'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                                 {msg.sender === 'user' && (
                                    <div className="p-2 bg-muted rounded-full text-muted-foreground">
                                        <User className="h-6 w-6" />
                                    </div>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                 <div className="p-2 bg-primary rounded-full text-primary-foreground">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <div className="rounded-lg px-4 py-2 bg-card border">
                                    <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                                 </div>
                            </div>
                         )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="flex w-full items-center space-x-2">
                    <Input 
                        placeholder="Type your message..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading}>
                        <Send className="h-4 w-4"/>
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
