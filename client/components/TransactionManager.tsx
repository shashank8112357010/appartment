import { useState, useEffect } from "react";
import {
    X, Search, Filter, Edit2, Trash2, Check, DollarSign, Calendar, FileText, User
} from "lucide-react";
import { Transaction, getTransactions, editTransaction, deleteTransaction } from "@/utils/financials";

interface TransactionManagerProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: string;
}

export function TransactionManager({ isOpen, onClose, currentUser }: TransactionManagerProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string>("ALL");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Transaction>>({});

    useEffect(() => {
        if (isOpen) {
            loadTransactions();
        }
    }, [isOpen]);

    const loadTransactions = () => {
        const sorted = getTransactions().sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(sorted);
    };

    const handleEditClick = (tx: Transaction) => {
        setEditingId(tx.id);
        setEditForm({
            amount: tx.amount,
            description: tx.description,
            date: tx.date.split('T')[0], // YYYY-MM-DD
            category: tx.category,
            type: tx.type
        });
    };

    const handleSave = () => {
        if (!editingId) return;

        const success = editTransaction(editingId, editForm, currentUser);
        if (success) {
            loadTransactions();
            setEditingId(null);
            setEditForm({});
        } else {
            alert("Failed to update transaction");
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
            const success = deleteTransaction(id, currentUser);
            if (success) {
                loadTransactions();
            }
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch =
            tx.description.toLowerCase().includes(search.toLowerCase()) ||
            tx.amount.toString().includes(search) ||
            tx.id.toLowerCase().includes(search.toLowerCase());

        const matchesFilter = filterType === "ALL" || tx.type === filterType;

        return matchesSearch && matchesFilter;
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Transaction Ledger
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">Manage and audit all financial records</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-800">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, verified amount, or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">All Transactions</option>
                            <option value="CREDIT">Credits (Income)</option>
                            <option value="DEBIT">Debits (Expenses)</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto p-0 bg-slate-50 dark:bg-slate-900/30">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-bold text-slate-500 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Details</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                            {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400 font-mono text-xs">
                                        {editingId === tx.id ? (
                                            <input
                                                type="date"
                                                value={String(editForm.date)}
                                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                                className="w-32 bg-slate-100 dark:bg-slate-900 border rounded p-1"
                                            />
                                        ) : (
                                            new Date(tx.date).toLocaleDateString()
                                        )}
                                        <div className="text-[10px] opacity-50">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                                    </td>

                                    <td className="px-4 py-3">
                                        {editingId === tx.id ? (
                                            <input
                                                type="text"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                className="w-full bg-slate-100 dark:bg-slate-900 border rounded p-1"
                                            />
                                        ) : (
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{tx.description}</p>
                                                <p className="text-[10px] text-slate-500 font-mono">{tx.id}</p>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        {editingId === tx.id ? (
                                            <select
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                                                className="bg-slate-100 dark:bg-slate-900 border rounded p-1 text-xs"
                                            >
                                                {['MAINTENANCE', 'ELECTRICITY', 'PENALTY', 'ADJUSTMENT', 'EXPENSE'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${tx.type === 'CREDIT'
                                                    ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800'
                                                    : 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800'
                                                }`}>
                                                {tx.category}
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        {editingId === tx.id ? (
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-xs">₹</span>
                                                <input
                                                    type="number"
                                                    value={editForm.amount}
                                                    onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                                                    className="w-20 bg-slate-100 dark:bg-slate-900 border rounded p-1 text-right"
                                                />
                                            </div>
                                        ) : (
                                            <span className={`font-black ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-500'}`}>
                                                {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {editingId === tx.id ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={handleSave}
                                                    className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg"
                                                    title="Save Changes"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg"
                                                    title="Cancel"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(tx)}
                                                    className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                                                    title="Edit Record"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tx.id)}
                                                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                    title="Delete Record"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <DollarSign className="h-8 w-8 opacity-20" />
                                            <p className="text-sm font-medium">No transactions found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center text-xs text-slate-500">
                    <p>Total Records: {filteredTransactions.length}</p>
                    <div className="flex gap-4">
                        <p>Total Credits: <span className="font-bold text-green-600">₹{filteredTransactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</span></p>
                        <p>Total Debits: <span className="font-bold text-red-600">₹{filteredTransactions.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
