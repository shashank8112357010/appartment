// Auto-reminder system for maintenance and facility work
export interface ReminderRule {
    id: string;
    type: 'maintenance' | 'facility' | 'payment' | 'festival';
    title: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    day?: number; // Day of month for monthly reminders
    enabled: boolean;
    lastTriggered?: Date;
    nextTrigger?: Date;
}

export const defaultReminders: ReminderRule[] = [
    {
        id: 'monthly-maintenance-due',
        type: 'payment',
        title: 'Monthly Maintenance Payment Due',
        frequency: 'monthly',
        day: 1, // 1st of every month
        enabled: true
    },
    {
        id: 'elevator-maintenance',
        type: 'maintenance',
        title: 'Elevator Maintenance Check',
        frequency: 'monthly',
        day: 15,
        enabled: true
    },
    {
        id: 'water-tank-cleaning',
        type: 'facility',
        title: 'Water Tank Cleaning',
        frequency: 'quarterly',
        enabled: true
    },
    {
        id: 'fire-safety-check',
        type: 'facility',
        title: 'Fire Safety Equipment Check',
        frequency: 'monthly',
        day: 10,
        enabled: true
    },
    {
        id: 'generator-servicing',
        type: 'maintenance',
        title: 'Generator Servicing',
        frequency: 'quarterly',
        enabled: true
    },
    {
        id: 'building-painting',
        type: 'maintenance',
        title: 'Building Exterior Painting Assessment',
        frequency: 'yearly',
        enabled: true
    },
    {
        id: 'pest-control',
        type: 'facility',
        title: 'Pest Control Service',
        frequency: 'quarterly',
        enabled: true
    },
    {
        id: 'cctv-maintenance',
        type: 'facility',
        title: 'CCTV System Check',
        frequency: 'monthly',
        day: 20,
        enabled: true
    },
    {
        id: 'payment-reminder',
        type: 'payment',
        title: 'Send Payment Reminders to Pending Owners',
        frequency: 'monthly',
        day: 5,
        enabled: true
    }
];

export function checkDueReminders(): ReminderRule[] {
    const today = new Date();
    const dueReminders: ReminderRule[] = [];

    defaultReminders.forEach(reminder => {
        if (!reminder.enabled) return;

        let isDue = false;

        switch (reminder.frequency) {
            case 'daily':
                isDue = true;
                break;

            case 'weekly':
                isDue = today.getDay() === 1; // Every Monday
                break;

            case 'monthly':
                if (reminder.day && today.getDate() === reminder.day) {
                    isDue = true;
                }
                break;

            case 'quarterly':
                // Check if it's the 1st of Jan, Apr, Jul, Oct
                if (today.getDate() === 1 && [0, 3, 6, 9].includes(today.getMonth())) {
                    isDue = true;
                }
                break;

            case 'yearly':
                if (today.getDate() === 1 && today.getMonth() === 0) { // Jan 1st
                    isDue = true;
                }
                break;
        }

        if (isDue) {
            dueReminders.push(reminder);
        }
    });

    return dueReminders;
}

export function getUpcomingReminders(daysAhead: number = 7): ReminderRule[] {
    const today = new Date();
    const upcoming: ReminderRule[] = [];

    defaultReminders.forEach(reminder => {
        if (!reminder.enabled) return;

        if (reminder.frequency === 'monthly' && reminder.day) {
            const nextDate = new Date(today.getFullYear(), today.getMonth(), reminder.day);
            if (nextDate < today) {
                nextDate.setMonth(nextDate.getMonth() + 1);
            }

            const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (daysUntil >= 0 && daysUntil <= daysAhead) {
                upcoming.push(reminder);
            }
        }
    });

    return upcoming;
}
