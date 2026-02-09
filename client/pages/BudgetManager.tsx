import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    PieChart,
    Plus,
    Edit2,
    Trash2,
    Download,
    CheckCircle2,
    AlertCircle,
    Building2,
    Activity,
    Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { addTransaction } from "@/utils/financials";
import { generateMonthlyReport } from "@/utils/reportGenerator";

interface BudgetItem {
    id: string;
    category: string;
    plannedAmount: number;
    actualAmount: number;
    month: string;
    year: number;
    notes: string;
}

interface MonthlyCollection {
    month: string;
    year: number;
    totalUnits: number;
    maintenancePerUnit: number;
    totalExpected: number;
    receivedIncome: number; // Actual amount received from owners
    totalPending: number;
    advanceCollected: number;
    openingBalance: number; // Balance from previous month
}

export default function BudgetManager() {
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
    const [monthlyCollections, setMonthlyCollections] = useState<MonthlyCollection[]>([]);
    const [showAddBudget, setShowAddBudget] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [maintenancePerUnit, setMaintenancePerUnit] = useState(250);
    const [totalUnits, setTotalUnits] = useState(10);

    // Budget form state
    const [newBudget, setNewBudget] = useState({
        category: "",
        plannedAmount: "",
        notes: ""
    });

    useEffect(() => {
        // Load budget data from localStorage
        const storedBudgets = localStorage.getItem("budgetItems");
        const storedCollections = localStorage.getItem("monthlyCollections");

        let loadedBudgets: BudgetItem[] = [];
        let loadedCollections: MonthlyCollection[] = [];

        if (storedBudgets) {
            loadedBudgets = JSON.parse(storedBudgets);
            setBudgetItems(loadedBudgets);
        } else {
            // Initialize with default budget items matching expense sheet
            const defaultBudgets: BudgetItem[] = [
                { id: "1", category: "Electricity Bill", plannedAmount: 3200, actualAmount: 3200, month: "January", year: 2026, notes: "Common area electricity" },
                { id: "2", category: "Maid Salary", plannedAmount: 8000, actualAmount: 8000, month: "January", year: 2026, notes: "Resumed 28/01/2026" },
                { id: "3", category: "Water Bill", plannedAmount: 1500, actualAmount: 1420, month: "January", year: 2026, notes: "Municipal water supply" },
                { id: "4", category: "Cleaning Supplies", plannedAmount: 800, actualAmount: 750, month: "January", year: 2026, notes: "Monthly supplies" },
                { id: "5", category: "Maintenance Repairs", plannedAmount: 2000, actualAmount: 1800, month: "January", year: 2026, notes: "Minor repairs" },
                { id: "6", category: "Electricity Bill", plannedAmount: 3200, actualAmount: 0, month: "February", year: 2026, notes: "Common area electricity" },
                { id: "7", category: "Maid Salary", plannedAmount: 8000, actualAmount: 0, month: "February", year: 2026, notes: "Monthly salary" },
                { id: "8", category: "Water Bill", plannedAmount: 1500, actualAmount: 0, month: "February", year: 2026, notes: "Municipal water supply" },
            ];
            loadedBudgets = defaultBudgets;
            setBudgetItems(defaultBudgets);
            localStorage.setItem("budgetItems", JSON.stringify(defaultBudgets));
        }

        if (storedCollections) {
            loadedCollections = JSON.parse(storedCollections);
            setMonthlyCollections(loadedCollections);
        } else {
            // Initialize with default collections matching expense sheet
            const defaultCollections: MonthlyCollection[] = [
                {
                    month: "February",
                    year: 2026,
                    totalUnits: 10,
                    maintenancePerUnit: 250,
                    totalExpected: 2500,
                    receivedIncome: 0,
                    totalPending: 0,
                    advanceCollected: 0,
                    openingBalance: 11387 // Closing balance from January = Net Balance
                },
                {
                    month: "January",
                    year: 2026,
                    totalUnits: 10,
                    maintenancePerUnit: 250,
                    totalExpected: 2500,
                    receivedIncome: 115406, // Total Collection matching expense sheet
                    totalPending: 888, // Total Pending from expense sheet
                    advanceCollected: 250, // Manish Tomar advance
                    openingBalance: 2850 // Opening Balance from expense sheet
                },
            ];
            loadedCollections = defaultCollections;
            setMonthlyCollections(defaultCollections);
            localStorage.setItem("monthlyCollections", JSON.stringify(defaultCollections));
        }

        // Initialize with current month
        initializeCurrentMonth(loadedCollections, loadedBudgets);
    }, []);

    // Helper to calculate closing balance for any month
    const getClosingBalance = (month: string, year: number, collections: MonthlyCollection[], budgets: BudgetItem[]) => {
        const collection = collections.find(c => c.month === month && c.year === year);
        if (!collection) return 0;

        const monthBudgets = budgets.filter(b => b.month === month && b.year === year);
        const totalExpenses = monthBudgets.reduce((sum, b) => sum + (b.actualAmount || 0), 0);

        const totalIncome = (collection.receivedIncome || 0) + (collection.advanceCollected || 0);

        return (collection.openingBalance || 0) + totalIncome - totalExpenses;
    };

    const initializeCurrentMonth = (currentCollections: MonthlyCollection[], currentBudgets: BudgetItem[]) => {
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        const currentYear = new Date().getFullYear();

        // Calculate Opening Balance from Previous Month
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let prevMonthIndex = months.indexOf(currentMonth) - 1;
        let prevYear = currentYear;

        if (prevMonthIndex < 0) {
            prevMonthIndex = 11;
            prevYear = currentYear - 1;
        }

        const prevMonthName = months[prevMonthIndex];
        const prevClosingBalance = getClosingBalance(prevMonthName, prevYear, currentCollections, currentBudgets);

        // Check if already exists
        const exists = currentCollections.find(c => c.month === currentMonth && c.year === currentYear);
        if (exists) return;

        const newCollection: MonthlyCollection = {
            month: currentMonth,
            year: currentYear,
            totalUnits,
            maintenancePerUnit,
            totalExpected: totalUnits * maintenancePerUnit,
            receivedIncome: 0,
            totalPending: 0,
            advanceCollected: 0,
            openingBalance: prevClosingBalance // Auto-Carry Forward
        };

        const updated = [newCollection, ...currentCollections];
        setMonthlyCollections(updated);
        localStorage.setItem("monthlyCollections", JSON.stringify(updated));
    };

    const addBudgetItem = () => {
        if (!newBudget.category || !newBudget.plannedAmount) {
            alert("Please fill in all required fields");
            return;
        }

        const monthName = new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' });

        const item: BudgetItem = {
            id: Date.now().toString(),
            category: newBudget.category,
            plannedAmount: parseFloat(newBudget.plannedAmount),
            actualAmount: 0,
            month: monthName,
            year: selectedYear,
            notes: newBudget.notes
        };

        const updated = [...budgetItems, item];
        setBudgetItems(updated);
        localStorage.setItem("budgetItems", JSON.stringify(updated));

        setNewBudget({ category: "", plannedAmount: "", notes: "" });
        setShowAddBudget(false);
    };

    const updateActualAmount = (id: string, amount: number) => {
        const updated = budgetItems.map(item =>
            item.id === id ? { ...item, actualAmount: amount } : item
        );
        setBudgetItems(updated);
        localStorage.setItem("budgetItems", JSON.stringify(updated));
    };

    const deleteBudgetItem = (id: string) => {
        const updated = budgetItems.filter(item => item.id !== id);
        setBudgetItems(updated);
        localStorage.setItem("budgetItems", JSON.stringify(updated));
    };

    // Calculate totals for selected month/year
    const monthName = new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' });
    const currentMonthBudgets = budgetItems.filter(
        item => item.month === monthName && item.year === selectedYear
    );

    const totalPlanned = currentMonthBudgets.reduce((sum, item) => sum + item.plannedAmount, 0);
    const totalActual = currentMonthBudgets.reduce((sum, item) => sum + item.actualAmount, 0);
    const variance = totalPlanned - totalActual;
    const variancePercent = totalPlanned > 0 ? ((variance / totalPlanned) * 100).toFixed(1) : "0";

    // Calculate yearly totals
    const yearlyBudgets = budgetItems.filter(item => item.year === selectedYear);
    const yearlyPlanned = yearlyBudgets.reduce((sum, item) => sum + item.plannedAmount, 0);
    const yearlyActual = yearlyBudgets.reduce((sum, item) => sum + item.actualAmount, 0);

    // Get collection data for selected month
    const currentCollection = monthlyCollections.find(
        c => c.month === monthName && c.year === selectedYear
    );

    const expectedIncome = totalUnits * maintenancePerUnit;
    const receivedIncome = currentCollection?.receivedIncome || 0;
    const advanceCollected = currentCollection?.advanceCollected || 0;
    const totalIncome = receivedIncome + advanceCollected;
    const netBalance = totalIncome - totalActual;

    const handleExportCSV = () => {
        const storedPayments = localStorage.getItem("globalPaymentHistory");
        const payments = storedPayments ? JSON.parse(storedPayments) : [];

        // Filter payments for this month
        const monthPayments = payments.filter((p: any) =>
            p.month === monthName && p.year === selectedYear
        );

        // Filter expenses
        const monthExpenses = currentMonthBudgets;

        // Combine into rows
        const rows = [
            ["Date", "Type", "Category", "Description", "Amount", "Status"],
            // Expenses
            ...monthExpenses.map(e => [
                `${monthName} ${selectedYear}`,
                "DEBIT",
                e.category,
                e.notes || "Budget Expense",
                e.actualAmount || 0,
                "PAID"
            ]),
            // Income
            ...monthPayments.map(p => [
                p.date,
                "CREDIT",
                "MAINTENANCE",
                `Flat ${p.flatNumber} - ${p.ownerName}`,
                p.amount,
                "PAID"
            ])
        ];

        let csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Financial_Report_${monthName}_${selectedYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const totalAdvanceHeld = monthlyCollections.reduce((sum, c) => sum + (c.advanceCollected || 0), 0);

        const reportData = {
            openingBalance: currentCollection?.openingBalance || 0,
            income: {
                maintenance: currentCollection?.receivedIncome || 0,
                advance: currentCollection?.advanceCollected || 0,
                other: 0
            },
            expenses: currentMonthBudgets.map(b => ({
                category: b.category,
                description: b.notes || b.category,
                amount: b.actualAmount || 0,
                billUploaded: false
            })),
            closingBalance: {
                cash: (currentCollection?.openingBalance || 0) + totalIncome - totalActual,
                bank: 0,
                advanceBalance: totalAdvanceHeld
            }
        };

        generateMonthlyReport({
            societyName: "BAJRANGEE APARTMENTS",
            reportTitle: "MONTHLY INCOME & EXPENSE REPORT",
            period: `${monthName} ${selectedYear}`
        }, reportData);
    };


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/admin" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                                Budget Manager
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Financial Planning & Tracking</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportCSV}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export Report</span>
                        </button>
                        <button
                            onClick={() => setShowAddBudget(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-blue-200 dark:shadow-none"
                        >
                            <Plus className="h-4 w-4" />
                            Add Budget
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-4 space-y-4">
                {/* Month/Year Selector */}
                <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div className="flex-1 grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Month
                                    </label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i} value={i}>
                                                {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Year
                                    </label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        {[2024, 2025, 2026, 2027].map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Income Collection Section */}
                <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                    <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            Income Collection - {monthName} {selectedYear}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                    Maintenance Collection (₹)
                                </label>
                                <input
                                    type="number"
                                    value={currentCollection?.receivedIncome || 0}
                                    onChange={(e) => {
                                        const amount = parseFloat(e.target.value) || 0;
                                        const updated = monthlyCollections.map(c =>
                                            c.month === monthName && c.year === selectedYear
                                                ? { ...c, receivedIncome: amount }
                                                : c
                                        );
                                        setMonthlyCollections(updated);
                                        localStorage.setItem("monthlyCollections", JSON.stringify(updated));
                                    }}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-green-500"
                                    placeholder="0"
                                />
                                <p className="text-xs text-slate-500 mt-1">From all flats</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                    Advance Collected (₹)
                                </label>
                                <input
                                    type="number"
                                    value={currentCollection?.advanceCollected || 0}
                                    onChange={(e) => {
                                        const amount = parseFloat(e.target.value) || 0;
                                        const updated = monthlyCollections.map(c =>
                                            c.month === monthName && c.year === selectedYear
                                                ? { ...c, advanceCollected: amount }
                                                : c
                                        );
                                        setMonthlyCollections(updated);
                                        localStorage.setItem("monthlyCollections", JSON.stringify(updated));
                                    }}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                                <p className="text-xs text-slate-500 mt-1">Advance payments</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                    Pending Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    value={currentCollection?.totalPending || 0}
                                    onChange={(e) => {
                                        const amount = parseFloat(e.target.value) || 0;
                                        const updated = monthlyCollections.map(c =>
                                            c.month === monthName && c.year === selectedYear
                                                ? { ...c, totalPending: amount }
                                                : c
                                        );
                                        setMonthlyCollections(updated);
                                        localStorage.setItem("monthlyCollections", JSON.stringify(updated));
                                    }}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-orange-500"
                                    placeholder="0"
                                />
                                <p className="text-xs text-slate-500 mt-1">Outstanding dues</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Collection</span>
                                <span className="text-2xl font-bold text-green-600">
                                    ₹{((currentCollection?.receivedIncome || 0) + (currentCollection?.advanceCollected || 0)).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Maintenance + Advance</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 overflow-hidden group">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600">
                                        <DollarSign className="h-4 w-4" />
                                    </div>
                                    <Activity className="h-3 w-3 text-slate-300 group-hover:text-green-400 transition-colors" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Income</p>
                                <p className="text-xl font-black text-green-600">
                                    ₹{((currentCollection?.receivedIncome || 0) + (currentCollection?.advanceCollected || 0)).toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 overflow-hidden group">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                                        <Target className="h-4 w-4" />
                                    </div>
                                    <Activity className="h-3 w-3 text-slate-300 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Planned</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">
                                    ₹{totalPlanned.toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 overflow-hidden group">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                                        <TrendingDown className="h-4 w-4" />
                                    </div>
                                    <Activity className="h-3 w-3 text-slate-300 group-hover:text-orange-400 transition-colors" />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Actual Spent</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">
                                    ₹{totalActual.toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className={`border-0 shadow-sm ring-1 ${netBalance >= 0 ? 'ring-green-200 dark:ring-green-700' : 'ring-red-200 dark:ring-red-700'} bg-white dark:bg-slate-800 overflow-hidden group`}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-xl ${netBalance >= 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
                                        {netBalance >= 0 ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    </div>
                                    <Activity className={`h-3 w-3 text-slate-300 ${netBalance >= 0 ? 'group-hover:text-green-400' : 'group-hover:text-red-400'} transition-colors`} />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Balance</p>
                                <p className={`text-xl font-black ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{Math.abs(netBalance).toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Financial Summary - Matching Expense Sheet Format */}
                <Card className="border-0 shadow-sm ring-1 ring-blue-200 dark:ring-blue-700 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800">
                    <CardHeader className="p-4 pb-3 border-b border-blue-100 dark:border-blue-700">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            Financial Summary - {monthName} {selectedYear}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {/* Opening Balance */}
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                                <div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Opening Balance</span>
                                    <p className="text-xs text-slate-500">Balance from previous month</p>
                                </div>
                                <input
                                    type="number"
                                    value={currentCollection?.openingBalance || 0}
                                    onChange={(e) => {
                                        const amount = parseFloat(e.target.value) || 0;
                                        const updated = monthlyCollections.map(c =>
                                            c.month === monthName && c.year === selectedYear
                                                ? { ...c, openingBalance: amount }
                                                : c
                                        );
                                        setMonthlyCollections(updated);
                                        localStorage.setItem("monthlyCollections", JSON.stringify(updated));
                                    }}
                                    className="w-32 text-right text-lg font-bold text-blue-600 bg-transparent border-b border-slate-300 dark:border-slate-600 px-2 py-1 focus:border-blue-600 focus:outline-none"
                                    placeholder="0"
                                />
                            </div>

                            {/* Total Collection */}
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                                <div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Collection</span>
                                    <p className="text-xs text-slate-500">Maintenance + Advance</p>
                                </div>
                                <span className="text-lg font-bold text-green-600">
                                    ₹{totalIncome.toLocaleString()}
                                </span>
                            </div>

                            {/* Total Expenses */}
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                                <div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Expenses</span>
                                    <p className="text-xs text-slate-500">All budget items spent</p>
                                </div>
                                <span className="text-lg font-bold text-orange-600">
                                    ₹{totalActual.toLocaleString()}
                                </span>
                            </div>

                            {/* Closing Balance */}
                            <div className="flex justify-between items-center pb-3 border-b-2 border-slate-200 dark:border-slate-600">
                                <div>
                                    <span className="text-base font-bold text-slate-900 dark:text-white">Closing Balance</span>
                                    <p className="text-xs text-slate-500">Opening + Collection - Expenses</p>
                                </div>
                                <span className={`text-xl font-bold ${((currentCollection?.openingBalance || 0) + totalIncome - totalActual) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{((currentCollection?.openingBalance || 0) + totalIncome - totalActual).toLocaleString()}
                                </span>
                            </div>

                            {/* Net Cash in Hand */}
                            <div className="flex justify-between items-center pt-2">
                                <div>
                                    <span className="text-base font-bold text-blue-900 dark:text-blue-100">Net Cash in Hand</span>
                                    <p className="text-xs text-slate-500">Closing Balance + Advance</p>
                                </div>
                                <span className="text-2xl font-bold text-blue-600">
                                    ₹{((currentCollection?.openingBalance || 0) + totalIncome - totalActual + (currentCollection?.advanceCollected || 0)).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Budget Items List */}
                <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                    <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                        <CardTitle className="text-base font-bold">
                            {monthName} {selectedYear} Budget
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {currentMonthBudgets.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <PieChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No budget items for this month</p>
                                <button
                                    onClick={() => setShowAddBudget(true)}
                                    className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Add your first budget item
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {currentMonthBudgets.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{item.category}</h4>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${item.actualAmount > item.plannedAmount ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                        {item.actualAmount > item.plannedAmount ? 'Over' : 'In Target'}
                                                    </span>
                                                </div>
                                                {item.notes && (
                                                    <p className="text-xs text-slate-500 mt-1 font-medium">{item.notes}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => deleteBudgetItem(item.id)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-6 text-sm">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Planned</p>
                                                <p className="font-black text-blue-600 text-lg">₹{item.plannedAmount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Actual</p>
                                                <div className="relative group/input">
                                                    <input
                                                        type="number"
                                                        value={item.actualAmount}
                                                        onChange={(e) => updateActualAmount(item.id, parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 text-sm font-bold border-2 border-slate-100 rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:border-blue-500 outline-none transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Variance</p>
                                                <p className={`font-black text-lg ${item.plannedAmount - item.actualAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.plannedAmount - item.actualAmount >= 0 ? '+' : ''}₹{(item.plannedAmount - item.actualAmount).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4 w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((item.actualAmount / item.plannedAmount) * 100, 100)}%` }}
                                                className={`h-full ${item.actualAmount > item.plannedAmount ? 'bg-red-500' : 'bg-blue-600'}`}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Yearly Summary */}
                <Card className="border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                    <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                        <CardTitle className="text-base font-bold">
                            {selectedYear} Yearly Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Planned</p>
                                <p className="text-2xl font-bold text-blue-600">₹{yearlyPlanned.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Spent</p>
                                <p className="text-2xl font-bold text-orange-600">₹{yearlyActual.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Yearly Variance</span>
                                <span className={`text-lg font-bold ${yearlyPlanned - yearlyActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {yearlyPlanned - yearlyActual >= 0 ? '+' : ''}₹{(yearlyPlanned - yearlyActual).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Add Budget Modal */}
            {showAddBudget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Add Budget Item
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                For {monthName} {selectedYear}
                            </p>
                        </div>

                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={newBudget.category}
                                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                >
                                    <option value="">Select category</option>
                                    <option value="Maintenance">Maintenance & Repairs</option>
                                    <option value="Electricity">Electricity Bill</option>
                                    <option value="Water">Water Bill</option>
                                    <option value="Staff Salary">Staff Salary</option>
                                    <option value="Cleaning">Cleaning Supplies</option>
                                    <option value="Security">Security Services</option>
                                    <option value="Gardening">Gardening & Landscaping</option>
                                    <option value="Festival">Festival Celebration</option>
                                    <option value="Insurance">Insurance</option>
                                    <option value="Other">Other Expenses</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Planned Amount (₹) *
                                </label>
                                <input
                                    type="number"
                                    value={newBudget.plannedAmount}
                                    onChange={(e) => setNewBudget({ ...newBudget, plannedAmount: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    placeholder="Enter amount"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={newBudget.notes}
                                    onChange={(e) => setNewBudget({ ...newBudget, notes: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none"
                                    placeholder="Add any notes or details..."
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowAddBudget(false);
                                    setNewBudget({ category: "", plannedAmount: "", notes: "" });
                                }}
                                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addBudgetItem}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
                            >
                                Add Budget
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
