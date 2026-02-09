import { useState, useEffect, useRef } from "react";
import { Send, User, Building2, RefreshCw } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

interface Message {
    id: string;
    sender: "admin" | "owner";
    senderName: string;
    senderFlat?: number;
    text: string;
    timestamp: string;
}

export default function Chat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [role, setRole] = useState<"admin" | "owner" | null>(null);
    const [flatNumber, setFlatNumber] = useState<string>("");

    const loadMessages = async () => {
        try {
            const data = await api.getMessages();
            setMessages(data);
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userRole = localStorage.getItem("userRole") as "admin" | "owner";
        const flat = localStorage.getItem("flatNumber") || "";
        if (!userRole) {
            navigate("/");
            return;
        }
        setRole(userRole);
        setFlatNumber(flat);
        loadMessages();

        // Poll for new messages every 5 seconds
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage = {
            sender: role,
            senderName: role === "admin" ? "Admin" : `Flat ${flatNumber}`,
            senderFlat: role === "owner" ? parseInt(flatNumber) : undefined,
            text: inputText,
        };

        try {
            const result = await api.sendMessage(newMessage);
            setMessages([...messages, result.message]);
            setInputText("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("flatNumber");
        navigate("/");
    };

    const isMyMessage = (msg: Message) => {
        if (role === "admin" && msg.sender === "admin") return true;
        if (role === "owner" && msg.sender === "owner" && msg.senderFlat === parseInt(flatNumber)) return true;
        return false;
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-blue-600 to-green-600 p-2">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Community Chat</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Bajrangi Apartment</p>
                        </div>
                    </div>
                    <button
                        onClick={loadMessages}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <RefreshCw className="h-5 w-5 text-slate-500" />
                    </button>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 pb-24 sm:pb-24">
                <div className="max-w-3xl mx-auto space-y-4">
                    {loading ? (
                        <div className="text-center text-slate-500 py-8">Loading messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-slate-500 py-8">No messages yet. Start the conversation!</div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = isMyMessage(msg);
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
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
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
