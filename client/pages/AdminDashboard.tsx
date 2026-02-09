import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Edit2,
  Save,
  LogOut,
  Package,
  Bell,
  Send,
  Menu,
  CheckCircle2,
  XCircle,
  Download,
  Mail,
  MessageCircle,
  Smartphone,
  Bot,
  FileSpreadsheet,
  Calendar,
  PartyPopper,
  PieChart,
  X,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Video,
  Key
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUpcomingFestivals, shouldShowGreeting, type Festival } from "@/utils/festivals";
import { checkDueReminders, getUpcomingReminders } from "@/utils/autoReminders";
import {
  generatePendingReport,
  generateAdvanceReport,
  generateYearlySummary,
  generateFestivalReport
} from "@/utils/reportGenerator";
import { TransactionManager } from "@/components/TransactionManager";
import { addTransaction, logAudit, loadFinancialsFromServer } from "@/utils/financials";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initial data sync from server
    loadFinancialsFromServer().then(success => {
      if (success) {
        const saved = localStorage.getItem("apartments_data");
        if (saved) setApartments(JSON.parse(saved));

        // Also refresh transactions list if needed by components
      }
    });
  }, []);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showTransactionManager, setShowTransactionManager] = useState(false);
  const [showFestivalGreeting, setShowFestivalGreeting] = useState(false);
  const [currentFestival, setCurrentFestival] = useState<Festival | null>(null);
  const [upcomingFestivals, setUpcomingFestivals] = useState<Festival[]>([]);
  const [showFestivalPlanner, setShowFestivalPlanner] = useState(false);
  const [showFundAllocation, setShowFundAllocation] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [allocationNotes, setAllocationNotes] = useState("");
  const [allocatedFunds, setAllocatedFunds] = useState<Record<string, { amount: number, notes: string, date: string, year: number }>>({});
  const [showCCTVModal, setShowCCTVModal] = useState(false);
  const [isEditingCCTV, setIsEditingCCTV] = useState(false);
  const [cctvCredentials, setCctvCredentials] = useState({
    userId: "miradwal.kumar@gmail.com",
    password: "hero@9227",
    verificationCode: "QQMODP",
    appLink: "https://play.google.com/store/apps/details?id=com.connect.enduser&hl=en_IN"
  });

  // Admin Payment Collection State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAptForPayment, setSelectedAptForPayment] = useState<any>(null);
  const [adminPaymentData, setAdminPaymentData] = useState({
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: "MAINTENANCE" as any,
    notes: "",
    proof: ""
  });

  // Activity & Audit State
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Load allocated funds from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("festivalFunds");
    if (stored) {
      setAllocatedFunds(JSON.parse(stored));
    }

    // Load CCTV credentials from localStorage
    const storedCCTV = localStorage.getItem("cctv_credentials");
    if (storedCCTV) {
      setCctvCredentials(JSON.parse(storedCCTV));
    }

    // Load Audit Logs
    const storedLogs = localStorage.getItem("financial_audit_logs");
    if (storedLogs) {
      setAuditLogs(JSON.parse(storedLogs));
    }
  }, [showAuditLogs]); // Refresh when modal opens

  useEffect(() => {
    // Load notifications from localStorage
    const stored = localStorage.getItem("notifications");
    const storedNotifs = stored ? JSON.parse(stored) : [];
    setNotifications(storedNotifs);
    setUnreadCount(storedNotifs.filter((n: any) => !n.read).length);

    // Check for festival greetings
    const { show, festival } = shouldShowGreeting();
    if (show && festival) {
      setCurrentFestival(festival);
      setShowFestivalGreeting(true);
    }

    // Load upcoming festivals
    setUpcomingFestivals(getUpcomingFestivals(60)); // Next 60 days

    // Check for due reminders and create notifications
    const dueReminders = checkDueReminders();
    if (dueReminders.length > 0) {
      const reminderNotifs = dueReminders.map(reminder => ({
        id: `reminder-${Date.now()}-${reminder.id}`,
        flatNumber: "Admin",
        owner: "System",
        title: reminder.title,
        message: `Auto-Reminder: ${reminder.title} is due today.`,
        date: new Date().toLocaleDateString(),
        type: reminder.type,
        read: false,
        createdAt: new Date(),
      }));

      const updated = [...reminderNotifs, ...storedNotifs];
      setNotifications(updated);
      setUnreadCount(updated.filter((n: any) => !n.read).length);
      localStorage.setItem("notifications", JSON.stringify(updated));
    }
  }, []);

  // Owner and apartment data
  // Updated flat data matching expense sheet (Feb 2026)
  const defaultApartments = [
    { id: 100, floor: "Ground Floor", owner: "AMAN", phone: "+91 97195 55369", status: "No dues till Feb'26", lastPayment: "Feb 2026", amount: 0, type: "neutral", advance: 0, pending: 0, deposit: 0 },
    { id: 101, floor: "1st Floor", owner: "SHARMA JI", phone: "+91 96506 54026", status: "No dues till Feb'26", lastPayment: "Feb 2026", amount: 0, type: "neutral", advance: 0, pending: 0, deposit: 0 },
    { id: 102, floor: "1st Floor", owner: "MANISH TOMAR", phone: "+91 99100 57679", status: "Advance till Mar'26", lastPayment: "Feb 2026", amount: 250, type: "advance", advance: 250, pending: 0, deposit: 0 },
    { id: 103, floor: "1st Floor", owner: "NAVEEN", phone: "+91 93128 90998", status: "Advance till Mar'26", lastPayment: "Feb 2026", amount: 250, type: "advance", advance: 250, pending: 0, deposit: 0 },
    { id: 201, floor: "2nd Floor", owner: "DANGWAL", phone: "+91 98104 15054", status: "Pending for Feb'26", lastPayment: "Jan 2026", amount: 250, type: "due", advance: 0, pending: 250, deposit: 0 },
    { id: 202, floor: "2nd Floor", owner: "GIRISH PANDEY", phone: "+91 99113 00816", status: "Pending for Oct'25-Feb'26", lastPayment: "Sep 2025", amount: 1250, type: "due", advance: 0, pending: 1250, deposit: 0 },
    { id: 203, floor: "2nd Floor", owner: "BIKRAM", phone: "+91 99112 20555", status: "Pending for Jan-Feb'26", lastPayment: "Dec 2025", amount: 500, type: "due", advance: 0, pending: 500, deposit: 0 },
    { id: 301, floor: "3rd Floor", owner: "GIRISH", phone: "+91 99999 71362", status: "Partial Advance till Mar'26", lastPayment: "Feb 2026", amount: 138, type: "advance", advance: 138, pending: 0, deposit: 0 },
    { id: 302, floor: "3rd Floor", owner: "ARVIND", phone: "+91 99996 06636", status: "Advance till Mar'26", lastPayment: "Feb 2026", amount: 250, type: "advance", advance: 250, pending: 0, deposit: 0 },
    { id: 303, floor: "3rd Floor", owner: "CHANDAN", phone: "+91 99118 28077", status: "No dues till Feb'26", lastPayment: "Feb 2026", amount: 0, type: "neutral", advance: 0, pending: 0, deposit: 0 },
  ];

  const [apartments, setApartments] = useState(() => {
    const saved = localStorage.getItem("apartments_data");
    return saved ? JSON.parse(saved) : defaultApartments;
  });

  // Sync owner profiles from localStorage AND persist apartments change
  useEffect(() => {
    // 1. Sync Owner Profiles (override name/phone if changed in Owner Dashboard/Settings)
    const updatedApartments = apartments.map((apt: any) => {
      const storedProfile = localStorage.getItem(`ownerProfile_${apt.id}`);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        // Only update if actually different to avoid unnecessary state updates
        if (parsed.name !== apt.owner || parsed.phone !== apt.phone) {
          return { ...apt, owner: parsed.name, phone: parsed.phone };
        }
      }
      return apt;
    });

    // Check if we need to update state (avoid infinite loop)
    if (JSON.stringify(updatedApartments) !== JSON.stringify(apartments)) {
      setApartments(updatedApartments);
    }

    // 2. Persist to localStorage
    localStorage.setItem("apartments_data", JSON.stringify(apartments));
  }, [apartments]);

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

    // Log the profile update
    const oldApt = apartments.find(a => a.id === id);
    if (oldApt) {
      const changes = [];
      if (oldApt.owner !== editValues.owner) changes.push(`Name: ${oldApt.owner} -> ${editValues.owner}`);
      if (oldApt.phone !== editValues.phone) changes.push(`Phone: ${oldApt.phone} -> ${editValues.phone}`);

      if (changes.length > 0) {
        logAudit('UPDATE_PROFILE', `Updated Flat ${id} profile. ${changes.join(', ')}`, 'Admin');
      }
    }

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedAptForReminder, setSelectedAptForReminder] = useState<any>(null);
  const [reminderChannels, setReminderChannels] = useState({
    email: true,
    sms: true,
    whatsapp: true,
    ai: true
  });

  const handleExport = () => {
    const headers = ["Flat No", "Floor", "Owner", "Phone", "Status", "Advance", "Pending"];
    const csvContent = [
      headers.join(","),
      ...apartments.map(apt =>
        [apt.id, apt.floor, apt.owner, apt.phone || "N/A", `"${apt.status}"`, apt.advance, apt.pending].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bajrangee_Apartments_Data_${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const buildings = ["Bajrangee Apartment"]; // Multi-building support in future

  const handleDownloadPendingReport = () => {
    const reportItems = apartments.map(apt => ({
      flatNo: apt.id.toString(),
      ownerName: apt.owner,
      pendingAmount: apt.pending,
      oldestPendingMonth: apt.pending > 0 ? "Jan'26" : "N/A", // Simulated logic
      totalPendingMonths: apt.pending > 0 ? Math.ceil(apt.pending / 2500) : 0
    }));

    generatePendingReport({
      societyName: "BAJRANGEE APARTMENTS",
      reportTitle: "PENDING DUES REPORT",
      period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    }, reportItems);
  };

  const handleDownloadAdvanceReport = () => {
    const reportItems = apartments.filter(apt => apt.advance > 0).map(apt => ({
      flatNo: apt.id.toString(),
      ownerName: apt.owner,
      advanceBalance: apt.advance,
      validTillMonth: "Mar'26" // Simulated logic
    }));

    generateAdvanceReport({
      societyName: "BAJRANGEE APARTMENTS",
      reportTitle: "ADVANCE BALANCE REPORT",
      period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    }, reportItems);
  };

  const handleDownloadYearlySummary = () => {
    // Simulated yearly breakdown
    const months = ["Apr'25", "May'25", "Jun'25", "Jul'25", "Aug'25", "Sep'25", "Oct'25", "Nov'25", "Dec'25", "Jan'26", "Feb'26", "Mar'26"];
    const items = months.map(m => ({
      month: m,
      income: 25000 + Math.random() * 5000,
      expense: 20000 + Math.random() * 3000,
      surplus: 0
    })).map(item => ({ ...item, surplus: item.income - item.expense }));

    generateYearlySummary({
      societyName: "BAJRANGEE APARTMENTS",
      reportTitle: "YEARLY FINANCIAL SUMMARY",
      period: "FY 2025-26"
    }, items);
  };

  const handleDownloadFestivalReport = (festival: Festival) => {
    const fund = allocatedFunds[festival.name] || { amount: 0, notes: "", date: "", year: 0 };

    generateFestivalReport(
      {
        societyName: "BAJRANGEE APARTMENTS",
        reportTitle: "FESTIVAL FUND REPORT",
        period: `${festival.name} ${new Date().getFullYear()}`
      },
      festival.name,
      festival.date,
      {
        allocated: fund.amount,
        actual: fund.amount * 0.85, // Simulation: assumes 85% spent
        balance: fund.amount * 0.15
      }
    );
  };

  const openReminderModal = (apt: any) => {
    setSelectedAptForReminder(apt);
    setShowReminderModal(true);
  };

  const sendMultiChannelReminder = () => {
    if (!selectedAptForReminder) return;

    const channels = Object.entries(reminderChannels)
      .filter(([_, enabled]) => enabled)
      .map(([channel]) => channel.toUpperCase());

    if (channels.length === 0) {
      alert("Please select at least one channel");
      return;
    }

    if (reminderChannels.ai) {
      // Send internal notification (AI)
      const newNotification = {
        id: Date.now().toString(),
        flatNumber: selectedAptForReminder.id.toString(),
        owner: selectedAptForReminder.owner,
        title: "Payment Reminder",
        message: `Dear ${selectedAptForReminder.owner}, this is a reminder to pay your maintenance dues.`,
        date: new Date().toLocaleDateString(),
        type: "payment",
        read: false,
        createdAt: new Date(),
      };
      const updated = [newNotification, ...notifications];
      setNotifications(updated);
      setUnreadCount(updated.filter((n: any) => !n.read).length);
      localStorage.setItem("notifications", JSON.stringify(updated));
    }

    alert(`Reminder sent to Flat ${selectedAptForReminder.id} via: ${channels.join(", ")}`);
    setShowReminderModal(false);
    setSelectedAptForReminder(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("flatNumber");
    navigate("/");
  };

  const openFundAllocation = (festival: Festival) => {
    setSelectedFestival(festival);
    const festivalKey = `${festival.name}-${festival.year || new Date().getFullYear()}`;
    const existing = allocatedFunds[festivalKey];
    if (existing) {
      setAllocatedAmount(existing.amount.toString());
      setAllocationNotes(existing.notes);
    } else {
      setAllocatedAmount(festival.budgetSuggestion.toString());
      setAllocationNotes("");
    }
    setShowFundAllocation(true);
  };

  const saveFundAllocation = () => {
    if (!selectedFestival || !allocatedAmount) {
      alert("Please enter an amount");
      return;
    }

    const amount = parseFloat(allocatedAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const festivalKey = `${selectedFestival.name}-${selectedFestival.year || new Date().getFullYear()}`;
    const newAllocation = {
      amount,
      notes: allocationNotes,
      date: new Date().toISOString(),
      year: selectedFestival.year || new Date().getFullYear()
    };

    const updated = { ...allocatedFunds, [festivalKey]: newAllocation };
    setAllocatedFunds(updated);
    localStorage.setItem("festivalFunds", JSON.stringify(updated));

    // Create a notification for the allocation
    const newNotification = {
      id: Date.now().toString(),
      flatNumber: "Admin",
      owner: "System",
      title: "Festival Fund Allocated",
      message: `₹${amount.toLocaleString()} allocated for ${selectedFestival.name}. ${allocationNotes}`,
      date: new Date().toLocaleDateString(),
      type: "festival",
      read: false,
      createdAt: new Date(),
    };
    const updatedNotifs = [newNotification, ...notifications];
    setNotifications(updatedNotifs);
    setUnreadCount(updatedNotifs.filter((n: any) => !n.read).length);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifs));

    setShowFundAllocation(false);
    setSelectedFestival(null);
    setAllocatedAmount("");
    setAllocationNotes("");
  };

  const saveCCTVCredentials = () => {
    localStorage.setItem("cctv_credentials", JSON.stringify(cctvCredentials));
    setIsEditingCCTV(false);

    // Create notification for the update
    const newNotification = {
      id: Date.now().toString(),
      flatNumber: "Admin",
      owner: "System",
      title: "CCTV Credentials Updated",
      message: "The CCTV system access credentials have been updated by admin.",
      date: new Date().toLocaleDateString(),
      type: "maintenance",
      read: false,
      createdAt: new Date(),
    };
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    setUnreadCount(updated.filter((n: any) => !n.read).length);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const handleAdminPaymentSubmit = () => {
    if (!selectedAptForPayment || !adminPaymentData.amount) {
      alert("Please enter a valid amount");
      return;
    }

    const amount = parseFloat(adminPaymentData.amount);
    const flatId = selectedAptForPayment.id.toString();

    // 1. Log Transaction
    addTransaction(
      'CREDIT',
      amount,
      adminPaymentData.category,
      `Admin recorded ${adminPaymentData.category.toLowerCase()} from Flat ${flatId}: ${adminPaymentData.notes}`,
      'Admin',
      flatId,
      adminPaymentData.proof
    );

    // 2. Update Apartment Local State (Pending/Advance)
    setApartments(prev => prev.map(apt => {
      if (apt.id === selectedAptForPayment.id) {
        let newPending = apt.pending;
        let newAdvance = apt.advance;

        // Simple logic: subtract from pending first, then add to advance
        if (newPending > 0) {
          const toDeduct = Math.min(newPending, amount);
          newPending -= toDeduct;
          const remaining = amount - toDeduct;
          newAdvance += remaining;
        } else {
          newAdvance += amount;
        }

        // Update status string based on result
        let newStatus = apt.status;
        if (newPending === 0) {
          newStatus = "No dues till Feb'26"; // Simplified status update
        }

        return { ...apt, pending: newPending, advance: newAdvance, status: newStatus };
      }
      return apt;
    }));

    // 3. Create notification for the Owner
    const newNotification = {
      id: Date.now().toString(),
      flatNumber: flatId,
      owner: selectedAptForPayment.owner,
      title: "Payment Confirmed",
      message: `Admin has recorded a payment of ₹${amount} for ${adminPaymentData.category.toLowerCase()} on your behalf. Tracking ID: RECP-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      type: "payment",
      read: false,
      createdAt: new Date(),
    };
    const updatedNotifs = [newNotification, ...notifications];
    setNotifications(updatedNotifs);
    setUnreadCount(updatedNotifs.filter((n: any) => !n.read).length);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifs));

    alert("Payment recorded successfully!");
    setShowPaymentModal(false);
    setAdminPaymentData({
      amount: "",
      date: new Date().toISOString().split('T')[0],
      category: "MAINTENANCE",
      notes: "",
      proof: ""
    });
  };

  // Financial summary matching expense sheet (as of Feb 2026)
  const buildingStats = {
    openingBalance: 2850,
    totalCollection: 115406,
    totalExpenses: 104019,
    totalBalance: 11387,
    netCashInHand: 12275, // Total Balance + Advance (888)
    totalAdvance: 888, // Sum of all advances
    totalPending: 2000, // Sum of all pending
    pendingMaintenance: 5,
    maidSalary: 8000,
    maintenanceDeposit: 25000,
    totalDeposits: apartments.reduce((sum, apt) => sum + apt.deposit, 0),
    // Notes for reference
    notes: [
      "Rs. 10035/- trfd by Kuldeep on 31/01/2026",
      "Maid resumed her service from 28/01/2026"
    ]
  };

  // Dashboard Activities (Live from Audit Logs)
  const dashboardActivities = auditLogs.slice(0, 5).map(log => ({
    id: log.id,
    type: log.action === 'ADD_TRANSACTION' ? 'credit' : 'system',
    title: log.details,
    date: log.timestamp,
    user: log.user
  }));

  const financialData = [
    { name: 'Sep', income: 28000, expense: 22000 },
    { name: 'Oct', income: 32000, expense: 25000 },
    { name: 'Nov', income: 29000, expense: 21000 },
    { name: 'Dec', income: 35000, expense: 28000 },
    { name: 'Jan', income: 31000, expense: 24000 },
    { name: 'Feb', income: 34000, expense: 26000 },
  ];

  // Compact StatCard
  const StatCard = ({ icon: Icon, label, value, subtext, colorClass, iconClass, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl p-4 ${colorClass} flex flex-col justify-between h-28 relative overflow-hidden transition-all hover:shadow-lg cursor-default group`}
    >
      <div className={`absolute top-3 right-3 p-2 rounded-xl transition-transform group-hover:scale-110 shadow-sm ${iconClass}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="mt-auto">
        <p className="text-[10px] font-bold opacity-70 mb-0.5 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black">{value}</p>
        <div className="flex items-center gap-1 opacity-60 mt-0.5">
          <Activity className="h-2.5 w-2.5" />
          <p className="text-[9px] font-medium">{subtext}</p>
        </div>
      </div>
    </motion.div>
  );

  // Compact ManagementCard
  const ManagementCard = ({
    icon: Icon,
    title,
    description,
    color,
    href,
  }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={href}
        className="group relative overflow-hidden rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md dark:bg-slate-800 dark:ring-slate-700 flex flex-col items-center justify-center text-center gap-2"
      >
        <div className={`rounded-2xl ${color} p-3 transition-transform group-hover:scale-110 shadow-sm`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="w-full">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {title}
          </h3>
          <p className="mt-0.5 text-[9px] text-slate-500 dark:text-slate-400 font-medium leading-none">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-md sm:max-w-3xl px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-600 p-1.5 text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Admin Dashboard</h1>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">Bajrangi Apartment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              <Bell className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-slate-800" />}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md sm:max-w-3xl px-4 py-4 space-y-4">

        {/* Festival Greeting Banner */}
        {showFestivalGreeting && currentFestival && (
          <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-4 rounded-xl shadow-lg animate-in slide-in-from-top duration-500">
            <button
              onClick={() => setShowFestivalGreeting(false)}
              className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <PartyPopper className="h-8 w-8" />
              <div>
                <h3 className="font-bold text-lg">{currentFestival.greeting}</h3>
                <p className="text-xs opacity-90">{currentFestival.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          <button
            onClick={() => setShowAddExpense(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Expense</span>
          </button>
          <button
            onClick={() => navigate('/budget')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Budget</span>
            <span className="sm:hidden">Budget</span>
          </button>
          <button
            onClick={handleExport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button
            onClick={() => setShowFestivalPlanner(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Calendar className="h-4 w-4" />
            Festivals
          </button>
          <button
            onClick={() => setShowTransactionManager(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Banknote className="h-4 w-4" />
            Ledger
          </button>
          <button
            onClick={() => setShowAuditLogs(true)}
            className="bg-slate-700 hover:bg-slate-800 text-white p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Activity className="h-4 w-4" />
            Activity
          </button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl h-12 mb-6 shadow-inner">
            <TabsTrigger value="dashboard" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md text-[10px] font-black h-9 uppercase">Dashboard</TabsTrigger>
            <TabsTrigger value="apartments" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md text-[10px] font-black h-9 uppercase">Units</TabsTrigger>
            <TabsTrigger value="apps" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md text-[10px] font-black h-9 uppercase">Vault</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
            {/* Stats Grid - Matching Expense Sheet */}
            <div className="grid grid-cols-2 gap-2">
              <StatCard
                icon={Banknote}
                label="Total Collection"
                value={`₹${buildingStats.totalCollection.toLocaleString('en-IN')}`}
                subtext="All received"
                colorClass="bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100"
                iconClass="bg-green-500"
              />
              <StatCard
                icon={TrendingUp}
                label="Total Expenses"
                value={`₹${buildingStats.totalExpenses.toLocaleString('en-IN')}`}
                subtext="All spent"
                colorClass="bg-orange-50 text-orange-900 dark:bg-orange-900/20 dark:text-orange-100"
                iconClass="bg-orange-500"
              />
              <StatCard
                icon={DollarSign}
                label="Total Balance"
                value={`₹${buildingStats.totalBalance.toLocaleString('en-IN')}`}
                subtext="Current balance"
                colorClass="bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
                iconClass="bg-blue-500"
                delay={0.2}
              />
              <StatCard
                icon={Package}
                label="Net Cash in Hand"
                value={`₹${buildingStats.netCashInHand.toLocaleString('en-IN')}`}
                subtext="Balance + Advance"
                colorClass="bg-purple-50 text-purple-900 dark:bg-purple-900/20 dark:text-purple-100"
                iconClass="bg-purple-500"
                delay={0.3}
              />
            </div>

            {/* Financial Health Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tighter">Financial Pulse</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Income vs Expenses (6 Months)</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-bold">In</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-[9px] font-bold">Out</span>
                  </div>
                </div>
              </div>

              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FB7185" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#FB7185" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fontWeight: 600, fill: '#64748B' }}
                      dy={5}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" stroke="#FB7185" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Live Activities Summary */}
            <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
              <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-tight">Recent Activity</CardTitle>
                <button onClick={() => setShowAuditLogs(true)} className="text-[10px] font-bold text-blue-600 uppercase">View All</button>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                {dashboardActivities.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className={`p-1.5 rounded-lg ${activity.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                          {activity.type === 'credit' ? <DollarSign className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{activity.title}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] text-slate-500 font-medium">{activity.date}</span>
                            <span className="text-[9px] text-slate-400 font-black uppercase">by {activity.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Package className="h-8 w-8 mx-auto text-slate-200" />
                    <p className="text-[10px] text-slate-400 font-medium mt-1">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm font-bold">Admin Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1 space-y-3">
                <div className="flex items-center justify-between text-center divide-x divide-slate-100 dark:divide-slate-700">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{auditLogs.length}</p>
                    <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wide">Total Logs</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-yellow-500">4.8</p>
                    <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wide">Rating</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-red-500">2</p>
                    <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wide">Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes from Expense Sheet */}
            <Card className="border-0 shadow-sm ring-1 ring-amber-200 dark:ring-amber-700 bg-amber-50/50 dark:bg-amber-900/10">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ul className="space-y-2">
                  {buildingStats.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apartments" className="space-y-3 animate-in slide-in-from-right-2 duration-300">
            {/* Reports Center */}
            <div className="grid grid-cols-3 gap-2 py-1">
              <button
                onClick={handleDownloadPendingReport}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-[10px] font-bold text-red-600 flex flex-col items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <FileSpreadsheet className="h-5 w-5 text-red-500" />
                Defaulters
              </button>
              <button
                onClick={handleDownloadAdvanceReport}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-[10px] font-bold text-green-600 flex flex-col items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <TrendingUp className="h-5 w-5 text-green-500" />
                Advance List
              </button>
              <button
                onClick={handleDownloadYearlySummary}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-[10px] font-bold text-blue-600 flex flex-col items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <PieChart className="h-5 w-5 text-blue-500" />
                FY Summary
              </button>
            </div>

            <div className="grid gap-2">
              {apartments.map((apt) => (
                <Card key={apt.id} className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Flat {apt.id}</h3>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{apt.floor} Floor</span>
                        </div>
                        {editingId === apt.id ? (
                          <div className="mt-2 space-y-2">
                            <input
                              value={editValues.owner}
                              onChange={(e) => setEditValues({ ...editValues, owner: e.target.value })}
                              className="w-full text-xs p-1 border rounded"
                              placeholder="Owner Name"
                            />
                            <input
                              value={editValues.phone}
                              onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })}
                              className="w-full text-xs p-1 border rounded"
                              placeholder="Phone"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => saveEdit(apt.id)} className="text-[10px] bg-green-600 text-white px-2 py-1 rounded">Save</button>
                              <button onClick={cancelEdit} className="text-[10px] bg-slate-200 text-slate-800 px-2 py-1 rounded">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-0.5">
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{apt.owner}</p>
                            <p className="text-[10px] text-slate-500">{apt.phone}</p>
                          </div>
                        )}
                      </div>
                      {!editingId && (
                        <button onClick={() => startEdit(apt)} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <p className="text-slate-500">Status</p>
                        <p className="font-medium text-slate-900 dark:text-white">{apt.status}</p>
                      </div>
                      <div className="text-right">
                        {apt.pending > 0 && <p className="text-red-500 font-bold">Pending: ₹{apt.pending}</p>}
                        {apt.advance > 0 && <p className="text-green-500 font-bold">Adv: ₹{apt.advance}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openReminderModal(apt)}
                        className="flex-1 bg-blue-50 text-blue-600 text-[10px] font-medium py-1.5 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="h-3 w-3" /> Remind
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAptForPayment(apt);
                          setShowPaymentModal(true);
                        }}
                        className="flex-1 bg-green-50 text-green-600 text-[10px] font-medium py-1.5 rounded-md hover:bg-green-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <DollarSign className="h-3 w-3" /> Record Collection
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="apps" className="space-y-3 animate-in slide-in-from-right-2 duration-300">
            <div className="grid grid-cols-2 gap-2">
              <ManagementCard icon={Wrench} title="Maintenance" description="Repairs & Jobs" color="bg-orange-500" href="/maintenance" />
              <ManagementCard icon={Zap} title="Electricity" description="Monthly Bills" color="bg-yellow-500" href="/electricity" />
              <ManagementCard icon={Users} title="Staff Salary" description="Maid Payments" color="bg-green-500" href="/salary" />
              <ManagementCard icon={Banknote} title="Deposits" description="Reserve Funds" color="bg-purple-500" href="/deposit" />
              <ManagementCard icon={Package} title="Cleaning" description="Supplies & Cost" color="bg-pink-500" href="/cleaning" />
              <ManagementCard icon={DollarSign} title="Admin Expenses" description="Misc. Costs" color="bg-indigo-500" href="/other" />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCCTVModal(true)}
                className="cursor-pointer"
              >
                <div className="group relative overflow-hidden rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md dark:bg-slate-800 dark:ring-slate-700 flex flex-col items-center justify-center text-center gap-2">
                  <div className="rounded-2xl bg-slate-600 p-3 transition-transform group-hover:scale-110 shadow-sm">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-full">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                      CCTV Access
                    </h3>
                    <p className="mt-0.5 text-[9px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                      Security & Monitoring
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <MobileBottomNav role="admin" unreadCount={unreadCount} onLogout={handleLogout} />

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-xs">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Add Building Expense</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Expense Title</label>
                <input type="text" className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="e.g., Lift Repair" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                <input type="number" className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input type="date" className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                  <option>Maintenance</option>
                  <option>Electricity</option>
                  <option>Staff Salary</option>
                  <option>Cleaning</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Remarks</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none"
                  placeholder="Add any additional notes or details about this expense..."
                />
              </div>
            </div>
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setShowAddExpense(false)}
                className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => { alert("Expense added!"); setShowAddExpense(false); }}
                className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Communication Modal */}
      {showReminderModal && selectedAptForReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-xs">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Send Reminder</h3>
              <p className="text-[10px] text-slate-500">To: {selectedAptForReminder.owner} (Flat {selectedAptForReminder.id})</p>
            </div>
            <div className="p-3 space-y-2">
              <p className="text-xs font-medium mb-1 text-slate-700 dark:text-slate-300">Select Channels:</p>

              <div
                onClick={() => setReminderChannels(prev => ({ ...prev, email: !prev.email }))}
                className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${reminderChannels.email ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'border-slate-200 dark:border-slate-700'}`}
              >
                <div className={`p-1.5 rounded-full ${reminderChannels.email ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <Mail className="h-3 w-3" />
                </div>
                <span className={`text-xs font-medium ${reminderChannels.email ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>Email Notification</span>
              </div>

              <div
                onClick={() => setReminderChannels(prev => ({ ...prev, sms: !prev.sms }))}
                className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${reminderChannels.sms ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'border-slate-200 dark:border-slate-700'}`}
              >
                <div className={`p-1.5 rounded-full ${reminderChannels.sms ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <Smartphone className="h-3 w-3" />
                </div>
                <span className={`text-xs font-medium ${reminderChannels.sms ? 'text-green-700 dark:text-green-300' : 'text-slate-600 dark:text-slate-400'}`}>SMS Alert</span>
              </div>

              <div
                onClick={() => setReminderChannels(prev => ({ ...prev, whatsapp: !prev.whatsapp }))}
                className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${reminderChannels.whatsapp ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-700'}`}
              >
                <div className={`p-1.5 rounded-full ${reminderChannels.whatsapp ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <MessageCircle className="h-3 w-3" />
                </div>
                <span className={`text-xs font-medium ${reminderChannels.whatsapp ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>WhatsApp Message</span>
              </div>

              <div
                onClick={() => setReminderChannels(prev => ({ ...prev, ai: !prev.ai }))}
                className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${reminderChannels.ai ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' : 'border-slate-200 dark:border-slate-700'}`}
              >
                <div className={`p-1.5 rounded-full ${reminderChannels.ai ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  <Bot className="h-3 w-3" />
                </div>
                <span className={`text-xs font-medium ${reminderChannels.ai ? 'text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400'}`}>AI & In-App Notification</span>
              </div>
            </div>
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={sendMultiChannelReminder}
                className="px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-black text-xs font-medium flex items-center gap-1.5"
              >
                <Send className="h-3 w-3" />
                Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Festival Planner Modal */}
      {showFestivalPlanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Festival Planner & Funds</h2>
              </div>
              <button
                onClick={() => setShowFestivalPlanner(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Upcoming Festivals (Next 60 Days)</h3>
                <p className="text-xs text-slate-500 mb-4">Plan celebrations and allocate funds for upcoming festivals</p>
              </div>

              {upcomingFestivals.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No festivals in the next 60 days</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingFestivals.map((festival, index) => {
                    const [month, day] = festival.date.split('-').map(Number);
                    const festivalDate = new Date(festival.year || new Date().getFullYear(), month - 1, day);
                    const daysUntil = Math.ceil((festivalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const festivalKey = `${festival.name}-${festival.year || new Date().getFullYear()}`;
                    const allocated = allocatedFunds[festivalKey];

                    return (
                      <Card key={index} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 dark:text-white">{festival.name}</h4>
                                {allocated && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Allocated
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{festival.description}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-medium">
                                {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Date</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {festivalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">{allocated ? 'Allocated' : 'Suggested Budget'}</p>
                              <p className={`text-sm font-semibold ${allocated ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                                ₹{(allocated ? allocated.amount : festival.budgetSuggestion).toLocaleString()}
                              </p>
                              {allocated && allocated.notes && (
                                <p className="text-xs text-slate-500 mt-1 italic">"{allocated.notes}"</p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => openFundAllocation(festival)}
                              className="mt-3 flex-1 bg-slate-900 dark:bg-slate-700 text-white text-xs py-2 rounded-lg hover:bg-black dark:hover:bg-slate-600 transition-colors"
                            >
                              {allocated ? 'Update Fund Allocation' : 'Allocate Fund & Plan'}
                            </button>
                            {allocated && (
                              <button
                                onClick={() => handleDownloadFestivalReport(festival)}
                                className="mt-3 px-3 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 shadow-sm"
                                title="Download Report"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2">💡 Festival Planning Tips</h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Start planning at least 2 weeks before major festivals</li>
                  <li>• Collect advance contributions from owners for large celebrations</li>
                  <li>• Book vendors (decorators, caterers) early to get better rates</li>
                  <li>• Coordinate with the RWA committee for approvals</li>
                  <li>• Send festival greetings automatically to all residents</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <div className="text-sm">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Total Allocated: ₹{Object.values(allocatedFunds).reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  {Object.keys(allocatedFunds).length} festival{Object.keys(allocatedFunds).length !== 1 ? 's' : ''} funded
                </p>
              </div>
              <button
                onClick={() => setShowFestivalPlanner(false)}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fund Allocation Modal */}
      {showFundAllocation && selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Allocate Funds for {selectedFestival.name}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {selectedFestival.description}
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Allocation Amount (₹)
                </label>
                <input
                  type="number"
                  value={allocatedAmount}
                  onChange={(e) => setAllocatedAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter amount"
                  min="0"
                  step="100"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Suggested budget: ₹{selectedFestival.budgetSuggestion.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={allocationNotes}
                  onChange={(e) => setAllocationNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Add planning notes, vendor details, or special requirements..."
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">💡 Planning Tip</h4>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Consider booking decorators and caterers at least 2 weeks in advance for better rates and availability.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
              <button
                onClick={() => {
                  setShowFundAllocation(false);
                  setSelectedFestival(null);
                  setAllocatedAmount("");
                  setAllocationNotes("");
                }}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveFundAllocation}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm font-medium flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Allocation
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CCTV Info Modal */}
      {showCCTVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 text-center border-b border-slate-100 dark:border-slate-700 relative">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-slate-600 dark:text-slate-300" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">CCTV System</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Building Security & Surveillance</p>

              <button
                onClick={() => setIsEditingCCTV(!isEditingCCTV)}
                className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit Credentials"
              >
                {isEditingCCTV ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User ID</span>
                  </div>
                  {isEditingCCTV ? (
                    <input
                      type="text"
                      value={cctvCredentials.userId}
                      onChange={(e) => setCctvCredentials({ ...cctvCredentials, userId: e.target.value })}
                      className="w-full bg-transparent text-sm font-black text-slate-900 dark:text-white border-0 p-0 focus:ring-0"
                    />
                  ) : (
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">{cctvCredentials.userId}</p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Key className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</span>
                  </div>
                  {isEditingCCTV ? (
                    <input
                      type="text"
                      value={cctvCredentials.password}
                      onChange={(e) => setCctvCredentials({ ...cctvCredentials, password: e.target.value })}
                      className="w-full bg-transparent text-sm font-black text-slate-900 dark:text-white border-0 p-0 focus:ring-0"
                    />
                  ) : (
                    <p className="text-sm font-black text-slate-900 dark:text-white">{cctvCredentials.password}</p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldAlert className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Code</span>
                  </div>
                  {isEditingCCTV ? (
                    <input
                      type="text"
                      value={cctvCredentials.verificationCode}
                      onChange={(e) => setCctvCredentials({ ...cctvCredentials, verificationCode: e.target.value })}
                      className="w-full bg-transparent text-sm font-black text-blue-600 dark:text-blue-400 border-0 p-0 focus:ring-0 uppercase"
                    />
                  ) : (
                    <p className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{cctvCredentials.verificationCode}</p>
                  )}
                </div>

                {isEditingCCTV && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Smartphone className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">App Link</span>
                    </div>
                    <input
                      type="text"
                      value={cctvCredentials.appLink}
                      onChange={(e) => setCctvCredentials({ ...cctvCredentials, appLink: e.target.value })}
                      className="w-full bg-transparent text-sm font-black text-slate-900 dark:text-white border-0 p-0 focus:ring-0"
                    />
                  </div>
                )}
              </div>

              {isEditingCCTV ? (
                <button
                  onClick={saveCCTVCredentials}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition-all"
                >
                  <Save className="h-4 w-4" />
                  Save Settings
                </button>
              ) : (
                <a
                  href={cctvCredentials.appLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all"
                >
                  <Smartphone className="h-4 w-4" />
                  Download App
                </a>
              )}

              <button
                onClick={() => {
                  setShowCCTVModal(false);
                  setIsEditingCCTV(false);
                }}
                className="w-full py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Close Portal
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Admin Payment Recording Modal */}
      {showPaymentModal && selectedAptForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Record Collection</h3>
                <p className="text-[10px] text-slate-500 font-medium">Flat {selectedAptForPayment.id} • {selectedAptForPayment.owner}</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      value={adminPaymentData.amount}
                      onChange={(e) => setAdminPaymentData({ ...adminPaymentData, amount: e.target.value })}
                      className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-2 pl-7 pr-3 text-sm font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Date</label>
                  <input
                    type="date"
                    value={adminPaymentData.date}
                    onChange={(e) => setAdminPaymentData({ ...adminPaymentData, date: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-2 px-3 text-sm font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {['MAINTENANCE', 'ELECTRICITY', 'PENALTY', 'ADJUSTMENT'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setAdminPaymentData({ ...adminPaymentData, category: cat as any })}
                      className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${adminPaymentData.category === cat ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Admin Notes</label>
                <textarea
                  value={adminPaymentData.notes}
                  onChange={(e) => setAdminPaymentData({ ...adminPaymentData, notes: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-0 rounded-xl py-2 px-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all resize-none"
                  rows={2}
                  placeholder="Payment method: Cash/UPI, reference details..."
                />
              </div>

              <button
                onClick={handleAdminPaymentSubmit}
                className="w-full py-3.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Collection
              </button>

              <p className="text-[9px] text-center text-slate-400 font-medium">
                Confirming will update owner balance and log an audit trail.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Audit Log Modal */}
      {showAuditLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 text-white rounded-xl">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Audit Trail & Activity</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Complete record of building management actions</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuditLogs(false)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {auditLogs.length > 0 ? auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${log.action.includes('ADD') ? 'bg-green-100 text-green-700' :
                      log.action.includes('LOCK') ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2">{log.details}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium italic">Action ID: {log.id}</span>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{log.user}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 mx-auto text-slate-200 mb-2" />
                  <p className="text-sm font-bold text-slate-400 uppercase">No Activity Recorded Yet</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <p className="text-[10px] text-slate-500 font-medium">Showing {auditLogs.length} activity records</p>
              <button
                onClick={() => {
                  const data = JSON.stringify(auditLogs, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Audit_Logs_${new Date().toISOString()}.json`;
                  a.click();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Export Audit
              </button>
            </div>
          </div>
        </div>
      )}
      <TransactionManager
        isOpen={showTransactionManager}
        onClose={() => setShowTransactionManager(false)}
        currentUser="Admin"
      />
    </div>
  );
}
