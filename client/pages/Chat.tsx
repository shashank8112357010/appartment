import { useState, useEffect, useRef } from "react";
import { Send, User, Building2 } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useNavigate } from "react-router-dom";

interface Message {
    id: string;
    sender: "user" | "admin" | "other";
    senderName: string;
    text: string;
    timestamp: Date;
}

export default function Chat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [role, setRole] = useState<"admin" | "owner" | null>(null);

    useEffect(() => {
        const userRole = localStorage.getItem("userRole") as "admin" | "owner";
        if (!userRole) {
            navigate("/");
            return;
        }
        setRole(userRole);

        // Load initial mock messages
        const initialMessages: Message[] = [
            {
                id: "1",
                sender: "admin",
                senderName: "Building Admin",
                text: "Welcome to the Bajrangee Apartment community chat! Please feel free to ask any questions regarding maintenance.",
                timestamp: new Date(Date.now() - 86400000), // 1 day ago
            },
            {
                id: "2",
                sender: "other",
                senderName: "Flat 101",
                text: "Is the water tank cleaning scheduled for tomorrow?",
                timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            },
        ];
        setMessages(initialMessages);
    }, [navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: "user",
            senderName: role === "admin" ? "Admin" : `Flat ${localStorage.getItem("flatNumber")}`,
            text: inputText,
            timestamp: new Date(),
        };

        setMessages([...messages, newMessage]);
        setInputText("");

        // Mock auto-response if user is owner
        if (role === "owner") {
            setTimeout(() => {
                const responseMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: "admin",
                    senderName: "Building Admin",
                    text: "Thank you for your message. We will look into it shortly.",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, responseMsg]);
            }, 1000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("flatNumber");
        navigate("/");
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-blue-600 to-green-600 p-2">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Community Chat</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Bajrangee Apartment</p>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 pb-24 sm:pb-24">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((msg) => {
                        const isMe = msg.sender === "user";
                        return (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                            >
                                <div
                                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === "admin"
                                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                                            : isMe
                                                ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                                                : "bg-slate-200 text-slate-600 dark:bg-slate-700"
                                        }`}
                                >
                                    <User className="h-4 w-4" />
                                </div>
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${isMe
                                            ? "bg-green-600 text-white"
                                            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                                        }`}
                                >
                                    <div className={`text-xs mb-1 ${isMe ? "text-green-100" : "text-slate-500 dark:text-slate-400"}`}>
                                        {msg.senderName}
                                    </div>
                                    <p className="text-sm">{msg.text}</p>
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? "text-green-100" : "text-slate-400"}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
                <form
                    onSubmit={handleSendMessage}
                    className="max-w-3xl mx-auto flex items-center gap-2 relative"
                >
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="rounded-full bg-blue-600 p-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>

            {role && <MobileBottomNav role={role} onLogout={handleLogout} />}
        </div>
    );
}
