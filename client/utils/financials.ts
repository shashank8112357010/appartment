
// Financial Transaction Types
export type TransactionType = 'CREDIT' | 'DEBIT'; // Credit = Money IN, Debit = Money OUT (Expense)
export type CategoryType = 'MAINTENANCE' | 'ADVANCE' | 'EXPENSE' | 'PENALTY' | 'ADJUSTMENT' | 'OPENING_BALANCE';

export interface Transaction {
    id: string;
    date: string; // ISO Date
    amount: number;
    type: TransactionType;
    category: CategoryType;
    flatId?: string; // Optional for common expenses
    description: string;
    proofUrl?: string; // Receipt/Bill URL
    createdBy: string; // User/Role
    timestamp: number;
}

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    user: string;
    timestamp: string;
}

export interface MonthlyFinancialSummary {
    month: string;
    year: number;
    openingBalance: number;
    totalIncome: number;
    totalExpense: number;
    closingBalance: number;
    isLocked: boolean;
}

// Key Constants
const STORAGE_KEYS = {
    TRANSACTIONS: 'financial_transactions',
    AUDIT_LOGS: 'financial_audit_logs',
    MONTHLY_SUMMARIES: 'financial_monthly_summaries'
};

// --- Sync Helper ---
const syncTransactions = async (transactions: Transaction[]) => {
    const payload = JSON.stringify(transactions);
    try {
        // First try standard API (Node)
        let res = await fetch('api/save-transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        });

        if (!res.ok) {
            // Fallback to PHP Handler for Shared Hosting
            await fetch('api.php?action=saveTransactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload
            });
        }
    } catch (e) {
        // Network error - try PHP directly
        try {
            await fetch('api.php?action=saveTransactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload
            });
        } catch (err) {
            console.error("Failed to sync transactions", err);
        }
    }
};

// --- Core Helper Functions ---

// 1. Get All Transactions
export const getTransactions = (): Transaction[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return stored ? JSON.parse(stored) : [];
};

// 2. Add a Transaction (Immutable Append)
export const addTransaction = (
    type: TransactionType,
    amount: number,
    category: CategoryType,
    description: string,
    createdBy: string,
    flatId?: string,
    proofUrl?: string
): Transaction => {
    const transactions = getTransactions();

    const newTx: Transaction = {
        id: `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        amount,
        type,
        category,
        description,
        createdBy,
        flatId,
        proofUrl,
        timestamp: Date.now()
    };

    transactions.push(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    syncTransactions(transactions); // Sync to server

    // Log Audit
    logAudit('ADD_TRANSACTION', `Added ${type} of ₹${amount} for ${description}`, createdBy);

    return newTx;
};

// 3. Log Audit Trail
export const logAudit = (action: string, details: string, user: string) => {
    const logs: AuditLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');

    const newLog: AuditLog = {
        id: `LOG-${Date.now()}`,
        action,
        details,
        user,
        timestamp: new Date().toLocaleString()
    };

    logs.unshift(newLog); // Newest first
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
};

// 4. Calculate Ledger Balance for a Flat
export const getFlatBalance = (flatId: string): { totalPaid: number, totalDue: number, balance: number } => {
    const transactions = getTransactions();

    // Filter for this flat
    const flatTx = transactions.filter(t => t.flatId === flatId);

    // Sum Credits (Payments)
    const totalPaid = flatTx
        .filter(t => t.type === 'CREDIT')
        .reduce((sum, t) => sum + t.amount, 0);

    // Sum Debits (Expected Dues/Penalties) - usually generated monthly
    const totalDue = flatTx
        .filter(t => t.type === 'DEBIT')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        totalPaid,
        totalDue,
        balance: totalPaid - totalDue // Positive = Advance, Negative = Pending
    };
};

// 5. Get Monthly Summary (derived dynamically from transactions)
export const getMonthlySummary = (monthName: string, year: number): MonthlyFinancialSummary => {
    // We need to calculate opening balance from previous month
    // For simplicity here, we'll traverse all transactions up to start of this month

    // Current implementation in BudgetManager expects stored summaries.
    // We will bridge this: Read stored summaries or calculate fresh.

    const summaries: MonthlyFinancialSummary[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MONTHLY_SUMMARIES) || '[]');
    const existing = summaries.find(s => s.month === monthName && s.year === year);

    if (existing) return existing;

    // Create default if not exists
    return {
        month: monthName,
        year,
        openingBalance: 0, // Should calculate from prev month!
        totalIncome: 0,
        totalExpense: 0,
        closingBalance: 0,
        isLocked: false
    };
};

// 6. Carry Forward Opening Balance (CRITICAL: Rule #4)
export const calculateCarryForward = (currentMonthName: string, currentYear: number): number => {
    const summaries: MonthlyFinancialSummary[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MONTHLY_SUMMARIES) || '[]');

    // Logic to find PREVIOUS month
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let prevMonthIndex = months.indexOf(currentMonthName) - 1;
    let prevYear = currentYear;

    if (prevMonthIndex < 0) {
        prevMonthIndex = 11;
        prevYear = currentYear - 1;
    }

    const prevMonthName = months[prevMonthIndex];
    const prevSummary = summaries.find(s => s.month === prevMonthName && s.year === prevYear);

    return prevSummary ? prevSummary.closingBalance : 0; // Default to 0 if no history
};

// 7. Lock Month (Rule #5 in Notification section)
export const lockMonth = (monthName: string, year: number, user: string) => {
    const summaries: MonthlyFinancialSummary[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MONTHLY_SUMMARIES) || '[]');
    const index = summaries.findIndex(s => s.month === monthName && s.year === year);

    if (index >= 0) {
        summaries[index].isLocked = true;
        localStorage.setItem(STORAGE_KEYS.MONTHLY_SUMMARIES, JSON.stringify(summaries));
        logAudit('LOCK_MONTH', `Month ${monthName} ${year} locked by Admin`, user);
        return true;
    }
    return false;
};

// 8. Edit Transaction
export const editTransaction = (id: string, updates: Partial<Transaction>, user: string) => {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        const oldTx = transactions[index];
        const newTx = { ...oldTx, ...updates };
        transactions[index] = newTx;
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
        syncTransactions(transactions); // Sync to server

        // Log specific changes
        const changes = Object.keys(updates).map(k => {
            const oldValue = oldTx[k as keyof Transaction];
            const newValue = newTx[k as keyof Transaction];
            return `${k}: ${oldValue} -> ${newValue}`;
        }).join(', ');

        logAudit('EDIT_TRANSACTION', `Edited Transaction ${id} (${oldTx.description}). Changes: ${changes}`, user);
        return true;
    }
    return false;
};

// 9. Delete Transaction
export const deleteTransaction = (id: string, user: string) => {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        const tx = transactions[index];
        transactions.splice(index, 1);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
        syncTransactions(transactions); // Sync to server

        logAudit('DELETE_TRANSACTION', `Deleted Transaction ${id}: ${tx.description} (${tx.amount})`, user);
        return true;
    }
    return false;
};

// 10. Load Data from Server (Bootstrapping from PHP/Node)
export const loadFinancialsFromServer = async () => {
    try {
        // Try Node endpoint first
        let res = await fetch('api/data');
        if (!res.ok) {
            // Fallback to PHP Endpoint
            res = await fetch('api.php?action=getData');
        }

        if (res.ok) {
            const data = await res.json();
            if (data.transactions && Array.isArray(data.transactions)) {
                localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
            }
            if (data.apartments && Array.isArray(data.apartments)) {
                localStorage.setItem("apartments_data", JSON.stringify(data.apartments));
            }
            return true;
        }
    } catch (e) {
        console.error("Failed to load data from server", e);
    }
    return false;
};
