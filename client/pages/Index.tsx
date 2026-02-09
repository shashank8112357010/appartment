import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  Users,
  Banknote,
  Zap,
  DollarSign,
  Building2,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  Edit2,
  Save,
  X,
} from "lucide-react";

export default function Index() {
  // Owner and apartment data
  const [apartments, setApartments] = useState([
    { id: 100, floor: "Ground", owner: "Rajesh Kumar", phone: "9876543210", deposit: 15000 },
    { id: 101, floor: "1st", owner: "Priya Singh", phone: "9876543211", deposit: 12000 },
    { id: 102, floor: "1st", owner: "Amit Patel", phone: "9876543212", deposit: 15000 },
    { id: 103, floor: "1st", owner: "Neha Sharma", phone: "9876543213", deposit: 12000 },
    { id: 201, floor: "2nd", owner: "Vikram Desai", phone: "9876543214", deposit: 15000 },
    { id: 202, floor: "2nd", owner: "Anita Gupta", phone: "9876543215", deposit: 12000 },
    { id: 203, floor: "2nd", owner: "Rohan Verma", phone: "9876543216", deposit: 15000 },
    { id: 301, floor: "3rd", owner: "Sunita Joshi", phone: "9876543217", deposit: 12000 },
    { id: 302, floor: "3rd", owner: "Karan Singh", phone: "9876543218", deposit: 15000 },
    { id: 303, floor: "3rd", owner: "Divya Nair", phone: "9876543219", deposit: 12000 },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ owner: "", phone: "" });

  const startEdit = (apt: typeof apartments[0]) => {
    setEditingId(apt.id);
    setEditValues({ owner: apt.owner, phone: apt.phone });
  };

  const saveEdit = (id: number) => {
    setApartments(
      apartments.map((apt) =>
        apt.id === id ? { ...apt, owner: editValues.owner, phone: editValues.phone } : apt
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // Sample data for dashboard
  const buildingStats = {
    totalExpenses: 45230,
    pendingMaintenance: 5,
    maidSalary: 8000,
    maintenanceDeposit: 25000,
    totalDeposits: apartments.reduce((sum, apt) => sum + apt.deposit, 0),
  };

  const recentItems = [
    {
      id: 1,
      type: "maintenance",
      title: "Roof Repair",
      amount: 2500,
      date: "2024-01-15",
      status: "pending",
    },
    {
      id: 2,
      type: "electricity",
      title: "January Electricity Bill",
      amount: 3200,
      date: "2024-01-10",
      status: "paid",
    },
    {
      id: 3,
      type: "salary",
      title: "Maid Monthly Salary",
      amount: 8000,
      date: "2024-01-01",
      status: "paid",
    },
    {
      id: 4,
      type: "cleaning",
      title: "Building Cleaning",
      amount: 1500,
      date: "2024-01-08",
      status: "paid",
    },
  ];

  const ManagementCard = ({
    icon: Icon,
    title,
    description,
    value,
    color,
    href,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    value?: string;
    color: string;
    href: string;
  }) => (
    <Link
      to={href}
      className="group relative overflow-hidden rounded-xl bg-white p-6 text-left shadow-sm transition-all hover:shadow-md dark:bg-slate-800"
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-5" />
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <div className={`mb-2 inline-block rounded-lg ${color} p-2`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {description}
          </p>
          {value && (
            <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              {value}
            </p>
          )}
        </div>
      </div>
    </Link>
  );

  const RecentItem = ({ item }: { item: (typeof recentItems)[0] }) => {
    const statusStyles = {
      paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };

    const typeIcons = {
      maintenance: Wrench,
      electricity: Zap,
      salary: Users,
      cleaning: Package,
    };

    const TypeIcon = typeIcons[item.type as keyof typeof typeIcons] || Package;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg bg-slate-50 p-3 sm:p-4 dark:bg-slate-700/50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="rounded-lg bg-slate-200 p-2 dark:bg-slate-600 flex-shrink-0">
            <TypeIcon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {item.title}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {item.date}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:gap-3">
          <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
            ₹{item.amount.toLocaleString()}
          </p>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ml-2 sm:ml-0 flex-shrink-0 ${statusStyles[item.status as keyof typeof statusStyles]}`}
          >
            {item.status}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-blue-600 to-green-600 p-2">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Bajrangee Apartment
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Building Management Portal
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  G-Floor (100) • 1st (101-103) • 2nd (201-203) • 3rd (301-303)
                </p>
              </div>
            </div>
            <button className="rounded-lg bg-blue-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500 w-full sm:w-auto">
              + Add Entry
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="mb-8 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                  Total Expenses
                </p>
                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                  ₹{(buildingStats.totalExpenses / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30 flex-shrink-0">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                  Issues
                </p>
                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {buildingStats.pendingMaintenance}
                </p>
              </div>
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30 flex-shrink-0">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                  Maid Salary
                </p>
                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                  ₹{(buildingStats.maidSalary / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30 flex-shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">
                  Maint. Deposit
                </p>
                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                  ₹{(buildingStats.maintenanceDeposit / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30 flex-shrink-0">
                <Banknote className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-6 shadow-sm border border-green-200 dark:border-green-900/50">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-green-700 dark:text-green-400 truncate">
                  Total Deposits
                </p>
                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold text-green-900 dark:text-green-300 truncate">
                  ₹{(buildingStats.totalDeposits / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="rounded-lg bg-green-200 dark:bg-green-900/50 p-2 flex-shrink-0">
                <Banknote className="h-4 w-4 sm:h-5 sm:w-5 text-green-700 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            Management Areas
          </h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ManagementCard
              icon={Wrench}
              title="Maintenance"
              description="Track and manage building repairs and maintenance"
              color="bg-orange-500"
              href="/maintenance"
            />
            <ManagementCard
              icon={Zap}
              title="Electricity Bills"
              description="Monitor monthly electricity consumption and bills"
              color="bg-yellow-500"
              href="/electricity"
            />
            <ManagementCard
              icon={Users}
              title="Maid Salary"
              description="Manage and track maid payment records"
              color="bg-green-500"
              href="/salary"
            />
            <ManagementCard
              icon={Banknote}
              title="Maintenance Deposit"
              description="Track maintenance and reserve fund deposits"
              color="bg-purple-500"
              href="/deposit"
            />
            <ManagementCard
              icon={Package}
              title="Cleaning Expenses"
              description="Record building cleaning and supplies costs"
              color="bg-pink-500"
              href="/cleaning"
            />
            <ManagementCard
              icon={DollarSign}
              title="Other Expenses"
              description="Track miscellaneous building expenses"
              color="bg-indigo-500"
              href="/other"
            />
          </div>
        </div>

        {/* Apartment Owners & Deposits */}
        <div className="mb-8 rounded-xl bg-white shadow-sm dark:bg-slate-800">
          <div className="border-b border-slate-200 px-4 sm:px-6 py-4 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Apartment Owners & Deposits
            </h2>
          </div>
          <div className="overflow-x-auto">
            <div className="grid gap-3 p-4 sm:p-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {apartments.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        Flat {apt.id}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {apt.floor} Floor
                      </p>
                    </div>
                    {editingId === apt.id ? (
                      <button
                        onClick={() => saveEdit(apt.id)}
                        className="rounded p-1 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(apt)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {editingId === apt.id ? (
                    <div className="space-y-2 mb-3">
                      <input
                        type="text"
                        value={editValues.owner}
                        onChange={(e) =>
                          setEditValues({ ...editValues, owner: e.target.value })
                        }
                        className="w-full rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-600 dark:text-white"
                        placeholder="Owner name"
                      />
                      <input
                        type="text"
                        value={editValues.phone}
                        onChange={(e) =>
                          setEditValues({ ...editValues, phone: e.target.value })
                        }
                        className="w-full rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-600 dark:text-white"
                        placeholder="Phone"
                      />
                      <button
                        onClick={cancelEdit}
                        className="w-full rounded bg-slate-200 px-2 py-1 text-xs text-slate-900 hover:bg-slate-300 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        {apt.owner}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {apt.phone}
                      </p>
                    </>
                  )}

                  <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Deposit
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      ₹{apt.deposit.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded-xl bg-white shadow-sm dark:bg-slate-800">
          <div className="border-b border-slate-200 px-4 sm:px-6 py-4 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Activities
              </h2>
              <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">View All</span>
              </button>
            </div>
          </div>
          <div className="space-y-3 p-4 sm:p-6">
            {recentItems.map((item) => (
              <RecentItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
