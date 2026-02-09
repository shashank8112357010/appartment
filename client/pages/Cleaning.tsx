import { useState, useEffect } from "react";
import { Package, Plus, Trash2, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function Cleaning() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"admin" | "owner" | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole") as "admin" | "owner";
    setRole(userRole || "admin");

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

  // Updated expense data matching current timeline (Feb 2026)
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      description: "Building Carpet Cleaning",
      amount: 2000,
      date: "2026-02-08",
      category: "professional",
    },
    {
      id: 2,
      description: "Cleaning Supplies & Materials",
      amount: 800,
      date: "2026-02-01",
      category: "supplies",
    },
    {
      id: 3,
      description: "Exterior Wall Cleaning",
      amount: 1500,
      date: "2026-01-25",
      category: "professional",
    },
    {
      id: 4,
      description: "Monthly Cleaning Supplies",
      amount: 500,
      date: "2026-01-15",
      category: "supplies",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const deleteItem = (id: number) => {
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const professionalCost = expenses
    .filter((e) => e.category === "professional")
    .reduce((sum, e) => sum + e.amount, 0);
  const suppliesCost = expenses
    .filter((e) => e.category === "supplies")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to={role === 'owner' ? '/owner' : '/admin'}
                className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-pink-100 p-2 dark:bg-pink-900/30">
                  <Package className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                  Cleaning
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-pink-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-pink-700 dark:hover:bg-pink-500 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-800">
            <h2 className="mb-4 text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              Add Cleaning Expense
            </h2>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Description"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                <select className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                  <option>Professional Service</option>
                  <option>Supplies</option>
                </select>
                <input
                  type="date"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 dark:hover:bg-pink-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 sm:flex-none rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Total Expenses
            </p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              ₹{totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Professional Services
            </p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-pink-600 dark:text-pink-400">
              ₹{professionalCost.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Supplies
            </p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              ₹{suppliesCost.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
              <Package className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                No cleaning expenses recorded yet
              </p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                      {expense.description}
                    </h3>
                    <p className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      {expense.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 pl-2">
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                        ₹{expense.amount.toLocaleString()}
                      </p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium mt-1 ${expense.category === "professional"
                          ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteItem(expense.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
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
