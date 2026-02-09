import { Home, Bell, LogOut, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
    role: "admin" | "owner";
    unreadCount?: number;
    onLogout: () => void;
}

export function MobileBottomNav({ role, unreadCount = 0, onLogout }: MobileBottomNavProps) {
    const location = useLocation();
    const basePath = role === "admin" ? "/admin" : "/owner";

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm px-6 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl rounded-[2rem] sm:hidden">
            <div className="flex items-center justify-between">
                <Link
                    to={basePath}
                    className={cn(
                        "flex flex-col items-center gap-1 transition-all duration-300",
                        isActive(basePath)
                            ? "text-blue-600 dark:text-blue-400 scale-110"
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-600"
                    )}
                >
                    <Home className={cn("h-5 w-5", isActive(basePath) && "fill-blue-600/10")} />
                    <span className={cn("text-[8px] font-black uppercase tracking-tighter", isActive(basePath) ? "opacity-100" : "opacity-0")}>Home</span>
                </Link>

                <Link
                    to="/chat"
                    className={cn(
                        "flex flex-col items-center gap-1 transition-all duration-300",
                        isActive("/chat")
                            ? "text-blue-600 dark:text-blue-400 scale-110"
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-600"
                    )}
                >
                    <MessageSquare className={cn("h-5 w-5", isActive("/chat") && "fill-blue-600/10")} />
                    <span className={cn("text-[8px] font-black uppercase tracking-tighter", isActive("/chat") ? "opacity-100" : "opacity-0")}>Chat</span>
                </Link>

                <Link
                    to="/notifications"
                    className={cn(
                        "flex flex-col items-center gap-1 transition-all duration-300",
                        isActive("/notifications")
                            ? "text-blue-600 dark:text-blue-400 scale-110"
                            : "text-slate-400 dark:text-slate-500 hover:text-slate-600"
                    )}
                >
                    <div className="relative">
                        <Bell className={cn("h-5 w-5", isActive("/notifications") && "fill-blue-600/10")} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white dark:ring-slate-800 animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <span className={cn("text-[8px] font-black uppercase tracking-tighter", isActive("/notifications") ? "opacity-100" : "opacity-0")}>Alerts</span>
                </Link>

                <button
                    onClick={onLogout}
                    className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-red-500 transition-all duration-300"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100">Exit</span>
                </button>
            </div>
        </div>
    );
}
