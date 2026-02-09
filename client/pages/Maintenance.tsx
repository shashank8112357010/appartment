import { useState, useEffect } from "react";
import { Wrench, Plus, Trash2, Check, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function Maintenance() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"admin" | "owner" | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole") as "admin" | "owner";
    setRole(userRole || "admin");

    // Load notifications count
    const notifs = localStorage.getItem("notifications");
    if (notifs) {
      const parsed = JSON.parse(notifs);
      setUnreadCount(parsed.filter((n: any) => !n.read).length);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("flatNumber");
    navigate("/");
  };

  // Updated maintenance items matching current timeline (Feb 2026)
  const [items, setItems] = useState([
    {
      id: 1,
      title: "Roof Repair",
      description: "Leak in main building roof",
      amount: 2500,
      date: "2026-02-08",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      title: "Plumbing Fix",
      description: "Water supply issue in 3rd floor",
      amount: 800,
      date: "2026-01-25",
      status: "completed",
      priority: "medium",
    },
    {
      id: 3,
      title: "Electrical Panel Upgrade",
      description: "Main electrical panel safety check",
      amount: 5000,
      date: "2026-02-01",
      status: "pending",
      priority: "high",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const toggleStatus = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
            ...item,
            status: item.status === "pending" ? "completed" : "pending",
          }
          : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const priorityColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-red-600/20",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 ring-yellow-600/20",
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-green-600/20",
  };

  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 ring-yellow-600/20",
    completed:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-green-600/20",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0 justify-between sm:justify-start w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <Link
                  to={role === 'owner' ? '/owner' : '/admin'}
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex-shrink-0"
                >
                  ← Back
                </Link>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30 flex-shrink-0">
                    <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                    Maintenance
                  </h1>
                </div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="sm:hidden rounded-full bg-orange-600 p-2 text-white shadow-sm hover:bg-orange-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="hidden sm:flex rounded-lg bg-orange-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-orange-700 dark:hover:bg-orange-500 items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Item
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {showForm && (
          <div className="mb-6 rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
            <h2 className="mb-4 text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              Add New Maintenance Item
            </h2>
            <form className="space-y-3 sm:space-y-4">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Title"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
              </div>
              <textarea
                placeholder="Description"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 dark:hover:bg-orange-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 sm:flex-none rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Items
            </p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {items.length}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Pending
            </p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {items.filter((i) => i.status === "pending").length}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Cost
            </p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              ₹{(items.reduce((sum, i) => sum + i.amount, 0) / 1000).toFixed(1)}K
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3 sm:space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
              <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-700">
                <Wrench className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                No maintenance items yet
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md dark:bg-slate-800 dark:ring-white/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`rounded-full p-2 transition-colors flex-shrink-0 ${item.status === "completed"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-400"
                          }`}
                      >
                        {item.status === "completed" ? (
                          <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-semibold text-sm sm:text-base ${item.status === "completed"
                              ? "line-through text-slate-500 dark:text-slate-400"
                              : "text-slate-900 dark:text-white"
                              }`}
                          >
                            {item.title}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${priorityColors[item.priority as keyof typeof priorityColors]}`}
                          >
                            {item.priority}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                          {item.description}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right gap-3 flex-shrink-0 border-t border-slate-100 dark:border-slate-700 pt-3 sm:border-0 sm:pt-0 mt-2 sm:mt-0">
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        ₹{item.amount.toLocaleString()}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${statusColors[item.status as keyof typeof statusColors]}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {role && <MobileBottomNav role={role} unreadCount={unreadCount} onLogout={handleLogout} />}
    </div>
  );
}
