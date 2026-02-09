import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types (Mirroring our Financial System) ---

export interface ReportHeader {
    societyName: string;
    reportTitle: string;
    period: string; // e.g., "February 2026"
}

export interface FinancialSummary {
    openingBalance: number;
    income: {
        maintenance: number;
        advance: number;
        other: number;
    };
    expenses: {
        category: string;
        description: string;
        amount: number;
        billUploaded: boolean;
    }[];
    closingBalance: {
        cash: number; // For now assuming simple total if not split
        bank: number;
        advanceBalance: number;
    };
}

export interface FlatLedgerItem {
    month: string;
    maintenanceAmount: number;
    paidAmount: number;
    advanceUsed: number;
    pendingAmount: number;
}

export interface PendingDueItem {
    flatNo: string;
    ownerName: string;
    pendingAmount: number;
    oldestPendingMonth: string;
    totalPendingMonths: number;
}

export interface AdvanceItem {
    flatNo: string;
    ownerName: string;
    advanceBalance: number;
    validTillMonth: string;
}

export interface ExpenseItem {
    date: string;
    category: string;
    description: string;
    amount: number;
    paymentMode: string;
    billReference: string;
    uploaded: boolean;
}

// --- Formatting Helpers ---

const formatCurrency = (amount: number) => {
    return 'Rs. ' + amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const BRAND_COLOR = [39, 174, 96] as [number, number, number]; // Green
const ALERT_COLOR = [231, 76, 60] as [number, number, number]; // Red
const TEXT_COLOR = [60, 60, 60] as [number, number, number]; // Black/Dark Grey

// --- Common PDF Elements ---

const addHeader = (doc: jsPDF, header: ReportHeader) => {
    const pageWidth = doc.internal.pageSize.width;

    // Society Name
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.text(header.societyName.toUpperCase(), pageWidth / 2, 20, { align: "center" });

    // Report Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(header.reportTitle, pageWidth / 2, 28, { align: "center" });

    // Period & Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Period: ${header.period}`, 20, 36);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 20, 36, { align: "right" });

    // Line Divider
    doc.setDrawColor(200);
    doc.line(20, 40, pageWidth - 20, 40);

    return 45; // Start Y for content
};

const addFooter = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("System Generated Report - Bajrangi Apartment Manager", pageWidth / 2, pageHeight - 10, { align: "center" });
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: "right" });
    }
};

// --- Report Generators ---

// 1. Monthly Income & Expense Report
export const generateMonthlyReport = (
    header: ReportHeader,
    data: FinancialSummary
) => {
    const doc = new jsPDF();
    let startY = addHeader(doc, header);

    // 1. Opening Balance
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.text(`1. Opening Balance: ${formatCurrency(data.openingBalance)}`, 20, startY);
    startY += 10;

    // 2. Income Table
    autoTable(doc, {
        startY: startY,
        head: [['Income Source', 'Amount']],
        body: [
            ['Maintenance Collection', formatCurrency(data.income.maintenance)],
            ['Advance Collection', formatCurrency(data.income.advance)],
            ['Other / Adjustments', formatCurrency(data.income.other)],
            [{ content: 'Total Income', styles: { fontStyle: 'bold' } }, { content: formatCurrency(data.income.maintenance + data.income.advance + data.income.other), styles: { fontStyle: 'bold' } }]
        ] as any[],
        theme: 'grid',
        headStyles: { fillColor: BRAND_COLOR, textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 }
    });

    startY = (doc as any).lastAutoTable.finalY + 15;

    // 3. Expense Breakdown
    doc.text("3. Expense Breakdown", 20, startY);
    startY += 5;

    const expenseRows = data.expenses.map(exp => [
        exp.category,
        exp.description,
        formatCurrency(exp.amount),
        exp.billUploaded ? "Yes" : "No"
    ]);

    const totalExpense = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    expenseRows.push([
        { content: 'Total Expenses', colSpan: 2, styles: { fontStyle: 'bold' } },
        { content: formatCurrency(totalExpense), styles: { fontStyle: 'bold' } },
        ''
    ] as any);

    autoTable(doc, {
        startY: startY,
        head: [['Category', 'Description', 'Amount', 'Bill?']],
        body: expenseRows as any[],
        theme: 'grid',
        headStyles: { fillColor: [200, 60, 60], textColor: 255 }, // Red for Expenses
        styles: { fontSize: 10, cellPadding: 3 }
    });

    startY = (doc as any).lastAutoTable.finalY + 15;

    // 4. Summary & Closing
    const surplus = (data.income.maintenance + data.income.advance + data.income.other) - totalExpense;

    doc.setFontSize(11);
    doc.text("4. Financial Summary", 20, startY);
    startY += 8;

    const summaryData = [
        ['Monthly Surplus / Deficit', formatCurrency(surplus)],
        ['Closing Balance (Cash + Bank)', formatCurrency(data.closingBalance.cash + data.closingBalance.bank)],
        ['Advance Balance Carry Fwd', formatCurrency(data.closingBalance.advanceBalance)]
    ];

    autoTable(doc, {
        startY: startY,
        body: summaryData as any[],
        theme: 'plain',
        styles: { fontSize: 11, fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 100 } }
    });

    addFooter(doc);
    doc.save(`MonthlyReport_${header.period}.pdf`);
};

// 2. Flat-wise Ledger Statement
export const generateFlatLedger = (
    header: ReportHeader,
    flatNo: string,
    ownerName: string,
    items: FlatLedgerItem[]
) => {
    const doc = new jsPDF();
    let startY = addHeader(doc, header);

    doc.setFontSize(12);
    doc.text(`Flat: ${flatNo} - ${ownerName}`, 20, startY);
    startY += 10;

    const rows = items.map(item => [
        item.month,
        formatCurrency(item.maintenanceAmount),
        formatCurrency(item.paidAmount),
        formatCurrency(item.advanceUsed),
        formatCurrency(item.pendingAmount)
    ]);

    // Totals
    const totalPaid = items.reduce((s, i) => s + i.paidAmount, 0);
    const totalPending = items.reduce((s, i) => s + i.pendingAmount, 0);

    rows.push([
        { content: 'TOTAL', styles: { fontStyle: 'bold' } },
        '-',
        { content: formatCurrency(totalPaid), styles: { fontStyle: 'bold', textColor: BRAND_COLOR } },
        '-',
        { content: formatCurrency(totalPending), styles: { fontStyle: 'bold', textColor: totalPending > 0 ? ALERT_COLOR : TEXT_COLOR } }
    ] as any);

    autoTable(doc, {
        startY: startY,
        head: [['Month', 'Maintenance', 'Paid', 'Adv. Used', 'Pending']],
        body: rows as any[],
        theme: 'grid',
        headStyles: { fillColor: [50, 50, 50] },
        styles: { fontSize: 10 }
    });

    addFooter(doc);
    doc.save(`Ledger_${flatNo}_${header.period}.pdf`);
};

// 3. Pending Dues Report
export const generatePendingReport = (
    header: ReportHeader,
    items: PendingDueItem[]
) => {
    const doc = new jsPDF();
    let startY = addHeader(doc, header);

    const rows = items.map(item => [
        item.flatNo,
        item.ownerName,
        formatCurrency(item.pendingAmount),
        item.oldestPendingMonth,
        item.totalPendingMonths.toString()
    ]);

    const totalPending = items.reduce((s, i) => s + i.pendingAmount, 0);

    rows.push([
        { content: 'TOTAL OUTSTANDING', colSpan: 2, styles: { fontStyle: 'bold' } },
        { content: formatCurrency(totalPending), styles: { fontStyle: 'bold', textColor: ALERT_COLOR } },
        '', ''
    ] as any);

    autoTable(doc, {
        startY: startY,
        head: [['Flat', 'Owner', 'Pending Amount', 'Since', 'Months']],
        body: rows as any[],
        theme: 'grid',
        headStyles: { fillColor: ALERT_COLOR },
        styles: { fontSize: 10 }
    });

    addFooter(doc);
    doc.save(`PendingDues_${header.period}.pdf`);
};

// 5. Expense Register (Audit)
export const generateExpenseRegister = (
    header: ReportHeader,
    items: ExpenseItem[]
) => {
    const doc = new jsPDF();
    let startY = addHeader(doc, header);

    const rows = items.map(item => [
        new Date(item.date).toLocaleDateString(),
        item.category,
        item.description,
        formatCurrency(item.amount),
        item.paymentMode,
        item.billReference || '-',
        item.uploaded ? 'Yes' : 'No'
    ]);

    autoTable(doc, {
        startY: startY,
        head: [['Date', 'Category', 'Description', 'Amount', 'Mode', 'Ref', 'Bill']],
        body: rows as any[],
        theme: 'striped',
        styles: { fontSize: 9 }
    });

    addFooter(doc);
    doc.save(`ExpenseAudit_${header.period}.pdf`);
};

// 4. Advance Balance Report
export const generateAdvanceReport = (
    header: ReportHeader,
    items: AdvanceItem[]
) => {
    const doc = new jsPDF();
    let startY = addHeader(doc, header);

    const rows = items.map(item => [
        item.flatNo,
        item.ownerName,
        formatCurrency(item.advanceBalance),
        item.validTillMonth
    ]);

    const totalAdvance = items.reduce((s, i) => s + i.advanceBalance, 0);

    rows.push([
        { content: 'TOTAL ADVANCE HELD', colSpan: 2, styles: { fontStyle: 'bold' } },
        { content: formatCurrency(totalAdvance), styles: { fontStyle: 'bold', textColor: BRAND_COLOR } },
        ''
    ] as any);

    autoTable(doc, {
        startY: startY,
        head: [['Flat', 'Owner', 'Advance Balance', 'Valid Till']],
        body: rows as any[],
        theme: 'grid',
        headStyles: { fillColor: BRAND_COLOR },
        styles: { fontSize: 10 }
    });

    addFooter(doc);
    doc.save(`AdvanceBalance_${header.period}.pdf`);
};

// 6. Festival Fund Report
export const generateFestivalReport = (
    header: ReportHeader,
    festivalName: string,
    festivalDate: string,
    data: { allocated: number; actual: number; balance: number }
) => {
    const doc = new jsPDF();
    let startY = addHeader(doc, { ...header, reportTitle: `FESTIVAL REPORT: ${festivalName}` });

    doc.setFontSize(12);
    doc.text(`Festival Date: ${festivalDate}`, 20, startY);
    startY += 12;

    autoTable(doc, {
        startY: startY,
        head: [['Description', 'Amount']],
        body: [
            ['Allocated Funds', formatCurrency(data.allocated)],
            ['Actual Expenses', formatCurrency(data.actual)],
            [{ content: 'Balance Remaining', styles: { fontStyle: 'bold' } }, { content: formatCurrency(data.balance), styles: { fontStyle: 'bold', textColor: data.balance >= 0 ? BRAND_COLOR : ALERT_COLOR } }]
        ] as any[],
        theme: 'grid',
        styles: { fontSize: 11 }
    });

    addFooter(doc);
    doc.save(`FestivalReport_${festivalName}_${header.period}.pdf`);
};

// 7. Yearly Financial Summary
export const generateYearlySummary = (
    header: ReportHeader,
    items: { month: string; income: number; expense: number; surplus: number }[]
) => {
    const doc = new jsPDF();
    let startY = addHeader(doc, header);

    const rows = items.map(item => [
        item.month,
        formatCurrency(item.income),
        formatCurrency(item.expense),
        { content: formatCurrency(item.surplus), styles: { textColor: item.surplus >= 0 ? BRAND_COLOR : ALERT_COLOR } }
    ]);

    const totalIncome = items.reduce((s, i) => s + i.income, 0);
    const totalExpense = items.reduce((s, i) => s + i.expense, 0);

    rows.push([
        { content: 'TOTAL FOR YEAR', styles: { fontStyle: 'bold' } },
        { content: formatCurrency(totalIncome), styles: { fontStyle: 'bold' } },
        { content: formatCurrency(totalExpense), styles: { fontStyle: 'bold' } },
        { content: formatCurrency(totalIncome - totalExpense), styles: { fontStyle: 'bold', textColor: (totalIncome - totalExpense) >= 0 ? BRAND_COLOR : ALERT_COLOR } }
    ] as any);

    autoTable(doc, {
        startY: startY,
        head: [['Month', 'Total Income', 'Total Expense', 'Surplus/Deficit']],
        body: rows as any[],
        theme: 'grid',
        headStyles: { fillColor: [44, 62, 80] },
        styles: { fontSize: 10 }
    });

    addFooter(doc);
    doc.save(`YearlySummary_${header.period}.pdf`);
};
