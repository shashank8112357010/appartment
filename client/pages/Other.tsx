import { useState } from "react";
import { DollarSign, Plus, Trash2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function Other() {
  // Updated expense data matching current timeline (Feb 2026)
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      description: "Water Tank Repair",
      amount: 3500,
      date: "2026-02-05",
      category: "repairs",
    },
    {
      id: 2,
      description: "Gate Maintenance",
      amount: 1200,
      date: "2026-01-20",
      category: "maintenance",
    },
    {
      id: 3,
      description: "Insurance Premium",
      amount: 5000,
      date: "2026-01-15",
      category: "insurance",
    },
    {
      id: 4,
      description: "Common Area Lights",
      amount: 750,
      date: "2026-01-10",
      category: "other",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const deleteItem = (id: number) => {
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryBreakdown = {
    repairs: expenses
      .filter((e) => e.category === "repairs")
      .reduce((sum, e) => sum + e.amount, 0),
    maintenance: expenses
      .filter((e) => e.category === "maintenance")
      .reduce((sum, e) => sum + e.amount, 0),
    insurance: expenses
      .filter((e) => e.category === "insurance")
      .reduce((sum, e) => sum + e.amount, 0),
    other: expenses
      .filter((e) => e.category === "other")
      .reduce((sum, e) => sum + e.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← Back to Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                  <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Other Expenses
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 dark:hover:bg-indigo-500 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Expense
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Add Miscellaneous Expense
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
                  <option>Repairs</option>
                  <option>Maintenance</option>
                  <option>Insurance</option>
                  <option>Other</option>
                </select>
                <input
                  type="date"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Total Expenses
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              ₹{totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Repairs
            </p>
            <p className="mt-2 text-2xl font-bold text-orange-600 dark:text-orange-400">
              ₹{categoryBreakdown.repairs.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Insurance
            </p>
            <p className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              ₹{categoryBreakdown.insurance.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Other
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              ₹{(categoryBreakdown.maintenance + categoryBreakdown.other).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
              <DollarSign className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                No miscellaneous expenses recorded yet
              </p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {expense.description}
                    </h3>
                    <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      {expense.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-right font-semibold text-slate-900 dark:text-white">
                        ₹{expense.amount.toLocaleString()}
                      </p>
                      <span className="inline-block rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
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
    </div>
  );
}
