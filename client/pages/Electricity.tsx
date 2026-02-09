import { useState, useEffect } from "react";
import { Zap, Plus, Trash2, TrendingUp, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function Electricity() {
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

  // Updated bills data matching current timeline (Feb 2026)
  const [bills, setBills] = useState([
    {
      id: 1,
      month: "February 2026",
      amount: 3200,
      units: 450,
      date: "2026-02-05",
      status: "pending",
    },
    {
      id: 2,
      month: "January 2026",
      amount: 2950,
      units: 420,
      date: "2026-01-12",
      status: "paid",
    },
    {
      id: 3,
      month: "December 2025",
      amount: 3100,
      units: 440,
      date: "2025-12-10",
      status: "paid",
    },
    {
      id: 4,
      month: "November 2025",
      amount: 2850,
      units: 410,
      date: "2025-11-10",
      status: "paid",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const deleteItem = (id: number) => {
    setBills(bills.filter((item) => item.id !== id));
  };

  const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
  const averageAmount = Math.round(totalAmount / bills.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={role === 'owner' ? '/owner' : '/admin'}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← Back
              </Link>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                  <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Electricity
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-full bg-yellow-600 p-2 text-white shadow-sm transition-colors hover:bg-yellow-700 dark:hover:bg-yellow-500 sm:rounded-lg sm:px-4 sm:py-2 sm:font-semibold"
            >
              <Plus className="h-5 w-5 sm:mr-2 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Add Bill</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {showForm && (
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Add New Electricity Bill
            </h2>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Month (e.g., January 2024)"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-yellow-500 focus:ring-yellow-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-yellow-500 focus:ring-yellow-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder="Units (kWh)"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-yellow-500 focus:ring-yellow-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                <input
                  type="date"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-yellow-500 focus:ring-yellow-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-bold text-white hover:bg-yellow-700 dark:hover:bg-yellow-500"
                >
                  Save Bill
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Spent
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Average
            </p>
            <p className="mt-1 text-xl font-bold text-yellow-600 dark:text-yellow-400">
              ₹{averageAmount.toLocaleString()}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Records
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {bills.length}
            </p>
          </div>
        </div>

        {/* Bills List */}
        <div className="space-y-3">
          {bills.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
              <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-700">
                <Zap className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                No bills recorded yet
              </p>
            </div>
          ) : (
            bills.map((bill) => (
              <div
                key={bill.id}
                className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md dark:bg-slate-800 dark:ring-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {bill.month}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{bill.units} kWh</span>
                      <span>•</span>
                      <span>{bill.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">
                        ₹{bill.amount.toLocaleString()}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-900/10">
                        {bill.status}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteItem(bill.id)}
                      className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
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
