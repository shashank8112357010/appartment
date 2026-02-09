import { useState } from "react";
import { Users, Plus, Trash2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function Salary() {
  // Updated salary data matching current timeline (Feb 2026)
  const [salaries, setSalaries] = useState([
    {
      id: 1,
      maidName: "Raminder Kaur",
      amount: 8000,
      month: "February 2026",
      date: "2026-02-01",
      status: "pending",
      notes: "Maid resumed service from 28/01/2026"
    },
    {
      id: 2,
      maidName: "Raminder Kaur",
      amount: 8000,
      month: "January 2026",
      date: "2026-01-28",
      status: "paid",
      notes: "Partial month - service resumed"
    },
    {
      id: 3,
      maidName: "Raminder Kaur",
      amount: 8000,
      month: "December 2025",
      date: "2025-12-01",
      status: "paid",
    },
    {
      id: 4,
      maidName: "Raminder Kaur",
      amount: 8000,
      month: "November 2025",
      date: "2025-11-01",
      status: "paid",
    },
    {
      id: 5,
      maidName: "Raminder Kaur",
      amount: 8000,
      month: "October 2025",
      date: "2025-10-01",
      status: "paid",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const deleteItem = (id: number) => {
    setSalaries(salaries.filter((item) => item.id !== id));
  };

  const totalPaid = salaries.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.amount, 0);

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
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Maid Salary
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 dark:hover:bg-green-500 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Salary
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Add Salary Payment
            </h2>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Maid Name"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                <input
                  type="text"
                  placeholder="Month (e.g., January 2024)"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                />
                <input
                  type="date"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 dark:hover:bg-green-500"
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
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Total Paid
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              ₹{totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Monthly Payment
            </p>
            <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
              ₹8000
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Total Records
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {salaries.length}
            </p>
          </div>
        </div>

        {/* Salaries List */}
        <div className="space-y-3">
          {salaries.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
              <Users className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                No salary records yet
              </p>
            </div>
          ) : (
            salaries.map((salary) => (
              <div
                key={salary.id}
                className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {salary.maidName}
                    </h3>
                    <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      {salary.month}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-right font-semibold text-slate-900 dark:text-white">
                        ₹{salary.amount.toLocaleString()}
                      </p>
                      <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {salary.status}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteItem(salary.id)}
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
