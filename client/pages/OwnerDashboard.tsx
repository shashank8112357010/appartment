import { addTransaction } from "@/utils/financials";
import { generateFlatLedger } from "@/utils/reportGenerator";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Banknote,
  Building2,
  LogOut,
  User,
  Zap,
  DollarSign,
  AlertCircle,
  Bell,
  Edit2,
  Plus,
  FileText,
  UserPlus,
  Printer,
  ChevronRight,
  TrendingUp,
  Package,
  Settings,
  CreditCard,
  History,
  PieChart as PieChartIcon,
  ShieldCheck,
  Video,
  Key,
  Mail,
  Smartphone,
  ShieldAlert
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
  Cell
} from 'recharts';

import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [flatNumber, setFlatNumber] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [autoPay, setAutoPay] = useState(false);

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ name: "", phone: "" });

  // Tenant & Agreement State
  const [tenant, setTenant] = useState({ name: "", phone: "", rent: "15000", start: "" });
  const [showRentAgreement, setShowRentAgreement] = useState(false);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCCTVModal, setShowCCTVModal] = useState(false);
  const [cctvCredentials, setCctvCredentials] = useState({
    userId: "miradwal.kumar@gmail.com",
    password: "hero@9227",
    verificationCode: "QQMODP",
    appLink: "https://play.google.com/store/apps/details?id=com.connect.enduser&hl=en_IN"
  });

  useEffect(() => {
    const stored = localStorage.getItem("flatNumber");
    if (!stored) {
      navigate("/");
      return;
    }
    setFlatNumber(stored);

    // Default tenant data
    const storedTenant = localStorage.getItem(`tenantData_${stored}`);
    if (storedTenant) {
      setTenant(JSON.parse(storedTenant));
    } else {
      const defaultTenant = {
        name: "Amit Kumar",
        phone: "9876543210",
        rent: "18500",
        start: "2024-02-01"
      };
      setTenant(defaultTenant);
      localStorage.setItem(`tenantData_${stored}`, JSON.stringify(defaultTenant));
    }

    // Load CCTV credentials from localStorage
    const storedCCTV = localStorage.getItem("cctv_credentials");
    if (storedCCTV) {
      setCctvCredentials(JSON.parse(storedCCTV));
    }

    const notifs = localStorage.getItem("notifications");
    if (notifs) {
      const parsed = JSON.parse(notifs);
      const ownerNotifs = parsed.filter((n: any) => n.flatNumber === stored);
      setNotifications(ownerNotifs);
      setUnreadCount(ownerNotifs.filter((n: any) => !n.read).length);
    }
  }, [navigate]);

  // Detailed apartment data from verified expense sheet
  const apartmentsData: Record<string, any> = {
    "100": { id: 100, floor: "Ground Floor", owner: "AMAN", phone: "+91 97195 55369", deposit: 0, status: "No dues till Feb'26", advance: 0, pending: 0 },
    "101": { id: 101, floor: "1st Floor", owner: "SHARMA JI", phone: "+91 96506 54026", deposit: 0, status: "No dues till Feb'26", advance: 0, pending: 0 },
    "102": { id: 102, floor: "1st Floor", owner: "MANISH TOMAR", phone: "+91 99100 57679", deposit: 0, status: "Advance till Mar'26", advance: 250, pending: 0 },
    "103": { id: 103, floor: "1st Floor", owner: "NAVEEN", phone: "+91 93128 90998", deposit: 0, status: "Advance till Mar'26", advance: 250, pending: 0 },
    "201": { id: 201, floor: "2nd Floor", owner: "DANGWAL", phone: "+91 98104 15054", deposit: 0, status: "Pending for Feb'26", advance: 0, pending: 250 },
    "202": { id: 202, floor: "2nd Floor", owner: "GIRISH PANDEY", phone: "+91 99113 00816", deposit: 0, status: "Pending for Oct'25-Feb'26", advance: 0, pending: 1250 },
    "203": { id: 203, floor: "2nd Floor", owner: "BIKRAM", phone: "+91 99112 20555", deposit: 0, status: "Pending for Jan-Feb'26", advance: 0, pending: 500 },
    "301": { id: 301, floor: "3rd Floor", owner: "GIRISH", phone: "+91 99999 71362", deposit: 0, status: "Partial Advance till Mar'26", advance: 138, pending: 0 },
    "302": { id: 302, floor: "3rd Floor", owner: "ARVIND", phone: "+91 99996 06636", deposit: 0, status: "Advance till Mar'26", advance: 250, pending: 0 },
    "303": { id: 303, floor: "3rd Floor", owner: "CHANDAN", phone: "+91 99118 28077", deposit: 0, status: "No dues till Feb'26", advance: 0, pending: 0 },
  };

  const apartment = apartmentsData[flatNumber] || null;

  useEffect(() => {
    if (apartment && !editValues.name) {
      // Load saved profile if exists
      const savedProfile = localStorage.getItem(`ownerProfile_${flatNumber}`);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setEditValues(parsed);
        // data sync for display
        apartment.owner = parsed.name;
        apartment.phone = parsed.phone;
      } else {
        setEditValues({ name: apartment.owner, phone: apartment.phone || "" });
      }
    }
  }, [apartment, flatNumber]);

  const handleSaveProfile = () => {
    if (apartment) {
      apartment.owner = editValues.name;
      apartment.phone = editValues.phone;

      // Persist to localStorage
      localStorage.setItem(`ownerProfile_${flatNumber}`, JSON.stringify({
        name: editValues.name,
        phone: editValues.phone
      }));

      alert("Profile updated successfully!");
    }
    setIsEditing(false);
  };

  const paymentHistoryData: Record<string, any[]> = {
    "100": [
      { id: 1, month: "Sep-25", amount: 250, date: "2025-09", type: "Monthly Contribution", status: "paid" },
      { id: 2, month: "Oct-25", amount: 250, date: "2025-10", type: "Monthly Contribution", status: "paid" },
      { id: 3, month: "Nov-25", amount: 250, date: "2025-11", type: "Monthly Contribution", status: "paid" },
      { id: 4, month: "Mar-26", amount: 750, date: "2026-03", type: "Monthly Contribution", status: "paid" },
    ],
  };
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  useEffect(() => {
    // Current flat payments from global history
    const storedPayments = localStorage.getItem("globalPaymentHistory");
    const realH = storedPayments ? JSON.parse(storedPayments).filter((p: any) => p.flatNumber === flatNumber) : [];

    // Fallback to mock data for demo if no real payments
    const mockH = paymentHistoryData[flatNumber] || [
      { id: 1, month: "Jan-26", amount: 250, date: "2026-01", type: "Monthly Contribution", status: "paid" },
      { id: 2, month: "Feb-26", amount: 250, date: "2026-02", type: "Monthly Contribution", status: "paid" },
    ];

    // Format real payments to match table structure
    const formattedRealH = realH.map((p: any) => ({
      id: p.id,
      month: `${p.month.slice(0, 3)}-${p.year.toString().slice(-2)}`,
      amount: p.amount,
      date: p.date,
      type: "Maintenance",
      status: "paid"
    }));

    // Combine them, newest first
    setPaymentHistory([...formattedRealH, ...mockH]);
  }, [flatNumber]);

  const handleDownloadLedger = () => {
    // Logic for Current Financial Year (Apr to Mar)
    const today = new Date();
    let fyStartYear = today.getFullYear();
    if (today.getMonth() < 3) fyStartYear--; // Before April, start year is last year

    const months = [
      { name: "April", year: fyStartYear },
      { name: "May", year: fyStartYear },
      { name: "June", year: fyStartYear },
      { name: "July", year: fyStartYear },
      { name: "August", year: fyStartYear },
      { name: "September", year: fyStartYear },
      { name: "October", year: fyStartYear },
      { name: "November", year: fyStartYear },
      { name: "December", year: fyStartYear },
      { name: "January", year: fyStartYear + 1 },
      { name: "February", year: fyStartYear + 1 },
      { name: "March", year: fyStartYear + 1 }
    ];

    const maintenanceAmount = 2500; // Standard maintenance

    const ledgerItems = months.map(m => {
      // Find matches in history
      const match = paymentHistory.find(h => {
        const [hMonth, hYear] = h.month.split('-');
        return hMonth === m.name.slice(0, 3) && hYear === m.year.toString().slice(-2);
      });

      const paid = match ? parseFloat(match.amount) : 0;

      return {
        month: `${m.name} ${m.year}`,
        maintenanceAmount,
        paidAmount: paid,
        advanceUsed: 0,
        pendingAmount: Math.max(0, maintenanceAmount - paid)
      };
    });

    generateFlatLedger(
      {
        societyName: "BAJRANGEE APARTMENTS",
        reportTitle: "FLAT LEDGER STATEMENT",
        period: `FY ${fyStartYear}-${fyStartYear + 1}`
      },
      flatNumber || "N/A",
      apartment?.owner || "Owner",
      ledgerItems
    );
  };

  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    date: new Date().toISOString().split('T')[0],
    transactionId: "",
    notes: "",
    receipt: ""
  });

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("flatNumber");
    navigate("/");
  };

  const handleRemoveTenant = () => {
    if (window.confirm("Are you sure you want to remove the current tenant?")) {
      const clearedTenant = { name: "", phone: "", rent: "", start: "" };
      setTenant(clearedTenant);
      localStorage.setItem(`tenantData_${flatNumber}`, JSON.stringify(clearedTenant));
      alert("Tenant removed successfully.");
    }
  };

  const handlePaymentSubmit = () => {
    if (!paymentData.amount || !paymentData.date) {
      alert("Please enter amount and date");
      return;
    }

    // 1. Add to local payment history (for Owner view)
    const newPayment = {
      id: Date.now(),
      month: new Date(paymentData.date).toLocaleString('default', { month: 'short', year: '2-digit' }),
      amount: parseFloat(paymentData.amount),
      date: paymentData.date,
      type: "Monthly Contribution",
      status: "paid", // or 'pending' if you want admin approval first
      transactionId: paymentData.transactionId,
      notes: paymentData.notes,
      receipt: paymentData.receipt
    };

    // In a real app, we would push this to the backend. 
    // Here we'll just update the local display for demo purposes.
    // To persist this properly for this user across sessions, we'd need a more robust storage strategy.
    // For now, let's just alert success and update global budget.

    // Define date variables first
    const selectedDate = new Date(paymentData.date);
    const monthName = selectedDate.toLocaleString('default', { month: 'long' });
    const year = selectedDate.getFullYear();

    // 0. Log Transaction Audit
    addTransaction(
      'CREDIT',
      parseFloat(paymentData.amount),
      'MAINTENANCE',
      `Payment from Flat ${flatNumber} (${apartment?.owner || 'Unknown'})`,
      `Owner-Flat-${flatNumber}`,
      flatNumber,
      paymentData.receipt
    );

    // 2. Update Global Payment History (for Report generation)
    const storedPayments = localStorage.getItem("globalPaymentHistory");
    const globalPayments = storedPayments ? JSON.parse(storedPayments) : [];

    const paymentRecord = {
      id: Date.now(),
      flatNumber: flatNumber, // Track WHICH flat paid
      ownerName: apartment?.owner || "Unknown", // Track WHO paid
      amount: parseFloat(paymentData.amount),
      date: paymentData.date,
      month: monthName,
      year: year,
      transactionId: paymentData.transactionId,
      notes: paymentData.notes,
      type: "Maintenance"
    };

    globalPayments.push(paymentRecord);
    localStorage.setItem("globalPaymentHistory", JSON.stringify(globalPayments));

    // 3. Update Global Budget (Monthly Collections)
    const storedCollections = localStorage.getItem("monthlyCollections");
    let collections = storedCollections ? JSON.parse(storedCollections) : [];

    // Find or create collection for this month
    let monthCollection = collections.find((c: any) => c.month === monthName && c.year === year);

    if (!monthCollection) {
      // Create new if doesn't exist
      monthCollection = {
        month: monthName,
        year: year,
        totalUnits: 10,
        maintenancePerUnit: 250,
        totalExpected: 2500,
        receivedIncome: 0,
        totalPending: 0,
        advanceCollected: 0,
        openingBalance: 0
      };
      collections.push(monthCollection);
    }

    // Update income
    // Assuming 'Monthly Contribution' goes to receivedIncome
    // Advance logic could be more complex, but let's keep it simple for now
    monthCollection.receivedIncome = (monthCollection.receivedIncome || 0) + parseFloat(paymentData.amount);

    localStorage.setItem("monthlyCollections", JSON.stringify(collections));

    alert("Payment recorded successfully! Receipt uploaded.");
    setShowPayModal(false);
    setPaymentData({
      amount: "",
      date: new Date().toISOString().split('T')[0],
      transactionId: "",
      notes: "",
      receipt: ""
    });
  };

  const chartData = [
    { name: 'Oct', rent: 18500, maintenance: 2500 },
    { name: 'Nov', rent: 18500, maintenance: 2500 },
    { name: 'Dec', rent: 18500, maintenance: 2500 },
    { name: 'Jan', rent: 18500, maintenance: 2500 },
    { name: 'Feb', rent: 18500, maintenance: 2500 },
  ];

  const StatCard = ({ icon: Icon, label, value, subtext, colorClass, iconClass, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl p-4 ${colorClass} flex flex-col justify-between h-32 relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-default group`}
    >
      <div className={`absolute top-4 right-4 p-2 rounded-xl transition-transform group-hover:scale-110 shadow-sm ${iconClass}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="mt-auto">
        <p className="text-xs font-semibold opacity-70 mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black">{value}</p>
        <div className="flex items-center gap-1 opacity-60 mt-1">
          <TrendingUp className="h-3 w-3" />
          <p className="text-[10px] font-medium">{subtext}</p>
        </div>
      </div>

      {/* Decorative background circle */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 dark:bg-black/10 blur-2xl" />
    </motion.div>
  );

  if (!apartment) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="rounded-full border-4 border-blue-500 border-t-transparent w-12 h-12 mb-4"
      />
      <p className="text-slate-500 font-medium">Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-md sm:max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-600 p-2 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Bajrangi Apartment</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Flat {flatNumber} • {apartment.floor} Floor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border border-white dark:border-slate-800" />}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md sm:max-w-3xl px-4 py-4 space-y-6">

        <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between bg-white dark:bg-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Auto-Pay
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automatically pay monthly dues
              </p>
            </div>
            <Switch
              checked={autoPay}
              onCheckedChange={setAutoPay}
              className="data-[state=checked]:bg-blue-600"
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl h-14 mb-8 shadow-inner">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md text-xs font-bold transition-all">Overview</TabsTrigger>
            <TabsTrigger value="tenant" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md text-xs font-bold transition-all">Tenant</TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md text-xs font-bold transition-all">History</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md text-xs font-bold transition-all">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in slide-in-from-left-2 duration-300">
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={DollarSign}
                label="Advance Paid"
                value={`₹${apartment.advance}`}
                subtext="Secure Funds"
                colorClass="bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100"
                iconClass="bg-green-600"
              />
              <StatCard
                icon={AlertCircle}
                label="Pending Dues"
                value={`₹${apartment.pending}`}
                subtext="Due Immediate"
                colorClass="bg-orange-50 text-orange-900 dark:bg-orange-900/20 dark:text-orange-100"
                iconClass="bg-orange-600"
              />
              <StatCard
                icon={User}
                label="Tenant Rent"
                value={`₹${tenant.rent}`}
                subtext="Monthly Income"
                colorClass="bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
                iconClass="bg-blue-600"
              />
              <StatCard
                icon={PieChartIcon}
                label="Total Income"
                value="₹1,12,500"
                subtext="Last 6 Months"
                colorClass="bg-purple-50 text-purple-900 dark:bg-purple-900/20 dark:text-purple-100"
                iconClass="bg-purple-600"
                delay={0.4}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Cash Flow</h3>
                  <p className="text-xs text-slate-500">Rent vs Maintenance (Last 5 Months)</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-medium">Rent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-orange-400" />
                    <span className="text-[10px] font-medium">Maint.</span>
                  </div>
                </div>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#64748B' }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                      contentStyle={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="rent" radius={[4, 4, 0, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#3B82F6" fillOpacity={0.8} />
                      ))}
                    </Bar>
                    <Bar dataKey="maintenance" radius={[4, 4, 0, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#FB923C" fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-500" />
                Control Center
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddExpense(true)}
                  className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:bg-blue-50/50"
                >
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl"><Plus className="h-5 w-5" /></div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">New Exp</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddTenant(true)}
                  className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:bg-green-50/50"
                >
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl"><UserPlus className="h-5 w-5" /></div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Set Tenant</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRentAgreement(true)}
                  className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:bg-purple-50/50"
                >
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl"><FileText className="h-5 w-5" /></div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Agreement</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPayModal(true)}
                  className="flex flex-col items-center gap-2 p-3 bg-orange-600 rounded-3xl shadow-lg shadow-orange-200 dark:shadow-orange-900/20 transition-all"
                >
                  <div className="p-3 bg-white/20 text-white rounded-2xl font-bold"><Banknote className="h-5 w-5" /></div>
                  <span className="text-[10px] font-bold text-white">Make Pay</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCCTVModal(true)}
                  className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:bg-slate-50/50"
                >
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-2xl"><Video className="h-5 w-5" /></div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">CCTV</span>
                </motion.button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tenant" className="space-y-4 animate-in slide-in-from-right-2 duration-300">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Current Tenant</CardTitle>
                <button onClick={() => setShowAddTenant(true)} className="text-xs text-blue-600">Edit</button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{tenant.name}</p>
                    <p className="text-sm text-slate-500">{tenant.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500">Monthly Rent</p>
                    <p className="font-semibold">₹{tenant.rent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Lease Start</p>
                    <p className="font-semibold">{tenant.start || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowRentAgreement(true)} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">
                    View Rent Agreement
                  </button>
                  <button onClick={handleRemoveTenant} className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium">
                    Remove
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 animate-in slide-in-from-right-2 duration-300">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <History className="h-4 w-4 text-blue-500" />
                Ledger
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadLedger}
                className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-2xl hover:bg-blue-100 transition-colors uppercase tracking-tight"
                title="Download PDF Ledger"
              >
                <Printer className="h-3.5 w-3.5" />
                Download Statement
              </motion.button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase text-[10px]">Month</th>
                      <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase text-[10px]">Status</th>
                      <th className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase text-[10px] text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {paymentHistory.length > 0 ? paymentHistory.map((row) => (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={row.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{row.month}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white">₹{row.amount.toLocaleString('en-IN')}</td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center gap-2">
                            <Package className="h-8 w-8 opacity-20" />
                            <p className="text-sm font-medium">No transactions found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 animate-in slide-in-from-right-2 duration-300">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Account Settings</h3>

              <Card className="border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors" onClick={() => setIsEditing(true)}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{editValues.name || "Set Name"}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{editValues.phone || "Add Phone Number"}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>

                  <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Privacy & Security</p>
                        <p className="text-[10px] text-slate-500 font-medium">Manage your data and access</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Notifications</p>
                        <p className="text-[10px] text-slate-500 font-medium">Sound, Push & Email alerts</p>
                      </div>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full py-4 rounded-3xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm font-bold border border-red-100 dark:border-red-900/20 flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout Account
              </motion.button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <MobileBottomNav role="owner" unreadCount={unreadCount} onLogout={handleLogout} />

      {/* Rent Agreement Modal */}
      {showRentAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Rent Agreement (Preview)</h2>
              <button onClick={() => setShowRentAgreement(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400">
                <LogOut className="h-5 w-5 rotate-180" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 font-serif text-sm leading-relaxed text-slate-900 dark:text-slate-200 printable-content">
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold uppercase underline mb-2">RENT AGREEMENT / LEASE AGREEMENT (HARYANA)</h1>
              </div>

              <p className="mb-4">
                This Rent Agreement is made and executed on this <strong>{new Date().getDate()}</strong> day of <strong>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</strong> at <strong>Gurgaon</strong> (City / District), Haryana.
              </p>

              <h3 className="font-bold mb-2">1. PARTIES</h3>
              <p className="mb-4">This Agreement is entered into between:</p>

              <div className="mb-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                <p className="mb-1"><strong>Landlord / Lessor:</strong></p>
                <p>Name: <strong>{apartment?.owner || "____________________________"}</strong></p>
                <p>Father’s / Husband’s Name: ____________________________</p>
                <p>Address: Flat No. {apartment?.id}, Bajrangee Apartment, Gurgaon</p>
                <p>Mobile / Email: {apartment?.phone ? apartment.phone : "____________________________"}</p>
                <p>Aadhaar / PAN No.: ____________________________</p>
              </div>

              <div className="mb-4 text-center font-bold">AND</div>

              <div className="mb-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                <p className="mb-1"><strong>Tenant / Lessee:</strong></p>
                <p>Name: <strong>{tenant.name || "____________________________"}</strong></p>
                <p>Father’s / Husband’s Name: ____________________________</p>
                <p>Address: ____________________________</p>
                <p>Mobile / Email: {tenant.phone || "____________________________"}</p>
                <p>Aadhaar / PAN No.: ____________________________</p>
              </div>

              <p className="mb-4">Hereinafter referred to as “Landlord” and “Tenant” (jointly “Parties”).</p>

              <h3 className="font-bold mb-2">2. PROPERTY DETAILS</h3>
              <p className="mb-4">The Landlord agrees to let and the Tenant agrees to take on rent the residential property located at:</p>
              <p className="mb-4 pl-4">
                Address: Flat No. <strong>{apartment?.id}</strong>, Bajrangee Apartment<br />
                City / District: <strong>Gurgaon</strong>, Haryana – PIN <strong>122001</strong><br />
                (Hereinafter referred to as “Demised Premises”).
              </p>

              <h3 className="font-bold mb-2">3. TERM</h3>
              <p className="mb-4">
                This agreement shall commence on <strong>{tenant.start ? new Date(tenant.start).toLocaleDateString() : "___ / ___ / 20__"}</strong> and shall remain in force for a period of <strong>11 months</strong>.
              </p>
              <p className="mb-4 text-xs italic text-slate-500">
                (If the term is more than 11 months, registration is mandatory under the Registration Act, 1908. For 11 months or less, registration is optional, but recommended.)
              </p>

              <h3 className="font-bold mb-2">4. RENT & SECURITY DEPOSIT</h3>
              <div className="mb-4 pl-4">
                <p>(a) Monthly Rent: <strong>₹ {tenant.rent || "___________________"}</strong></p>
                <p>(b) Security Deposit: <strong>₹ {tenant.rent || "___________________"}</strong> (Refundable subject to terms)</p>
                <p>(c) Rent shall be payable in advance on or before the <strong>7th</strong> day of each calendar month.</p>
              </div>
              <p className="mb-4">Late payment penalty @ ₹ _________ per day will be charged if rent is not paid by due date.</p>

              <h3 className="font-bold mb-2">5. PAYMENT MODE</h3>
              <p className="mb-2">Rent shall be paid by: <br /> ☐ Bank Transfer / UPI / Cheque / Cash (as agreed)</p>
              <p className="mb-4">Account Details (for Bank / UPI): ____________________________</p>

              <h3 className="font-bold mb-2">6. UTILITIES & OTHER CHARGES</h3>
              <p className="mb-4">The Tenant shall pay / bear electricity, water, gas, society maintenance, sewerage, and all other municipal charges as applicable.</p>

              <h3 className="font-bold mb-2">7. SECURITY DEPOSIT</h3>
              <p className="mb-4">Security deposit shall be refunded within 15 days after expiry / termination of the agreement, after adjusting dues, if any.</p>

              <h3 className="font-bold mb-2">8. USE & OCCUPATION</h3>
              <p className="mb-4">The Tenant shall use the Demised Premises only for residential purposes and shall not carry out business / illegal activities.</p>

              <h3 className="font-bold mb-2">9. REPAIRS & MAINTENANCE</h3>
              <p className="mb-4">The Tenant shall keep the premises clean and in proper condition.<br />
                The Landlord shall be responsible for major structural repairs, whereas minor repairs shall be the Tenant’s responsibility.</p>

              <h3 className="font-bold mb-2">10. SUB-LETTING / ASSIGNMENT</h3>
              <p className="mb-4">The Tenant shall not sub-let the Demised Premises or part thereof without written consent of the Landlord.</p>

              <h3 className="font-bold mb-2">11. TERMINATION / NOTICE</h3>
              <p className="mb-4">Either party may terminate this Agreement by giving <strong>1 (One)</strong> month prior written notice to the other party.</p>

              <h3 className="font-bold mb-2">12. GOVERNING LAW</h3>
              <p className="mb-4">This agreement shall be governed by the Indian Contract Act, 1872, the Registration Act, 1908, and relevant provisions under the Haryana Urban (Control of Rent & Eviction) Act, 1973, as applicable.</p>

              <h3 className="font-bold mb-2">13. STAMP DUTY & REGISTRATION</h3>
              <p className="mb-4">The Parties agree to pay all applicable stamp duty and registration charges as per the law of Haryana. Stamp duty for rent/lease agreements depends on the duration and consideration and must be paid to make this Agreement admissible in evidence.</p>

              <h3 className="font-bold mb-2">14. WITNESSES</h3>
              <p className="mb-4">This Agreement is signed in the presence of the following witnesses:</p>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="font-bold mb-2">Witness 1:</p>
                  <p className="mb-1">Name: _______________________</p>
                  <p className="mb-1">Address: _____________________</p>
                  <p className="mt-4 pt-4 border-t border-slate-300 w-3/4">Signature</p>
                </div>
                <div>
                  <p className="font-bold mb-2">Witness 2:</p>
                  <p className="mb-1">Name: _______________________</p>
                  <p className="mb-1">Address: _____________________</p>
                  <p className="mt-4 pt-4 border-t border-slate-300 w-3/4">Signature</p>
                </div>
              </div>

              <p className="mt-8 mb-8 font-semibold">
                IN WITNESS WHEREOF, Parties have executed this Rent Agreement on the date and year first above written.
              </p>

              <div className="flex justify-between mt-12 px-4 page-break-inside-avoid">
                <div className="text-center">
                  <div className="w-40 border-t border-black dark:border-white mb-2 mx-auto"></div>
                  <p className="font-bold">LANDLORD / LESSOR</p>
                  <p className="text-sm">{apartment?.owner}</p>
                </div>
                <div className="text-center">
                  <div className="w-40 border-t border-black dark:border-white mb-2 mx-auto"></div>
                  <p className="font-bold">TENANT / LESSEE</p>
                  <p className="text-sm">{tenant.name}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
              <button onClick={() => setShowRentAgreement(false)} className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50">Close</button>
              <button onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"><Printer className="h-4 w-4" /> Print</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manage Tenant Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tenant Name</label>
                <input type="text" value={tenant.name} onChange={(e) => setTenant({ ...tenant, name: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Enter full name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="text" value={tenant.phone} onChange={(e) => setTenant({ ...tenant, phone: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Phone" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rent</label>
                <input type="number" value={tenant.rent} onChange={(e) => setTenant({ ...tenant, rent: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Amount" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" value={tenant.start} onChange={(e) => setTenant({ ...tenant, start: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setShowAddTenant(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={() => {
                localStorage.setItem(`tenantData_${flatNumber}`, JSON.stringify(tenant));
                setShowAddTenant(false);
                alert("Tenant details saved!");
              }} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700"><h2 className="text-lg font-bold">Add Expense</h2></div>
            <div className="p-6 space-y-4">
              <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Expense Title" />
              <input type="number" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Amount" />
              <input type="date" className="w-full rounded-lg border px-3 py-2 text-sm" />
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button onClick={() => setShowAddExpense(false)} className="px-4 py-2 rounded-lg hover:bg-slate-100">Cancel</button>
              <button onClick={() => { alert("Expense added!"); setShowAddExpense(false); }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Make Payment</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Payment Amount (₹)</label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Payment Date</label>
                <input
                  type="date"
                  value={paymentData.date}
                  onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Transaction ID</label>
                <input
                  type="text"
                  value={paymentData.transactionId}
                  onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="UPI Ref ID / Cheque No."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Upload Receipt</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Mocking file upload by creating a fake local URL or base64
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPaymentData({ ...paymentData, receipt: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {paymentData.receipt ? (
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-green-600 font-medium">Receipt Attached</p>
                          <p className="text-xs text-slate-500">Click to change</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <svg
                            className="mx-auto h-12 w-12 text-slate-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-slate-600 dark:text-slate-400">
                            <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              Upload a file
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, PDF up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Notes (Optional)</label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none"
                  placeholder="Additional details..."
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setShowPayModal(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
              <button
                onClick={handlePaymentSubmit}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Banknote className="h-4 w-4" />
                Pay Now
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
            <div className="p-6 text-center border-b border-slate-100 dark:border-slate-700">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-slate-600 dark:text-slate-300" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">CCTV System</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Building Security & Surveillance</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User ID</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{cctvCredentials.userId}</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Key className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{cctvCredentials.password}</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldAlert className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Code</span>
                  </div>
                  <p className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{cctvCredentials.verificationCode}</p>
                </div>
              </div>

              <a
                href={cctvCredentials.appLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all"
              >
                <Smartphone className="h-4 w-4" />
                Download App
              </a>

              <button
                onClick={() => setShowCCTVModal(false)}
                className="w-full py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
              >
                Close Portal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
