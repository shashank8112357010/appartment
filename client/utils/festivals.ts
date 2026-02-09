// Festival tracking and greeting system for Indian festivals
export interface Festival {
    name: string;
    date: string; // Format: MM-DD
    year?: number; // Optional for specific year
    greeting: string;
    description: string;
    budgetSuggestion: number; // Suggested budget in INR
}

export const festivals: Festival[] = [
    {
        name: "Republic Day",
        date: "01-26",
        greeting: "Happy Republic Day! Jai Hind! 🇮🇳",
        description: "National celebration with flag hoisting",
        budgetSuggestion: 2000
    },
    {
        name: "Holi",
        date: "03-14", // Approximate, varies by lunar calendar
        greeting: "Happy Holi! May your life be filled with colors of joy! 🎨",
        description: "Festival of colors - organize community celebration",
        budgetSuggestion: 5000
    },
    {
        name: "Independence Day",
        date: "08-15",
        greeting: "Happy Independence Day! Jai Hind! 🇮🇳",
        description: "National celebration with flag hoisting",
        budgetSuggestion: 2000
    },
    {
        name: "Janmashtami",
        date: "08-26", // Approximate
        greeting: "Happy Janmashtami! May Lord Krishna bless you! 🙏",
        description: "Krishna's birthday celebration",
        budgetSuggestion: 3000
    },
    {
        name: "Ganesh Chaturthi",
        date: "09-07", // Approximate
        greeting: "Happy Ganesh Chaturthi! Ganpati Bappa Morya! 🙏",
        description: "Lord Ganesha celebration",
        budgetSuggestion: 4000
    },
    {
        name: "Dussehra",
        date: "10-12", // Approximate
        greeting: "Happy Dussehra! May good triumph over evil! 🎉",
        description: "Victory of good over evil",
        budgetSuggestion: 3000
    },
    {
        name: "Diwali",
        date: "10-31", // Approximate, varies by lunar calendar
        greeting: "Happy Diwali! May your life be filled with light and prosperity! 🪔✨",
        description: "Festival of lights - major celebration with decorations",
        budgetSuggestion: 8000
    },
    {
        name: "Guru Nanak Jayanti",
        date: "11-15", // Approximate
        greeting: "Happy Guru Nanak Jayanti! Waheguru Ji Ka Khalsa! 🙏",
        description: "Guru Nanak's birthday",
        budgetSuggestion: 2000
    },
    {
        name: "Christmas",
        date: "12-25",
        greeting: "Merry Christmas! May you be blessed with peace and joy! 🎄",
        description: "Christmas celebration",
        budgetSuggestion: 3000
    },
    {
        name: "New Year",
        date: "01-01",
        greeting: "Happy New Year! Wishing you a prosperous year ahead! 🎊",
        description: "New Year celebration",
        budgetSuggestion: 4000
    }
];

export function getUpcomingFestivals(daysAhead: number = 30): Festival[] {
    const today = new Date();
    const upcoming: Festival[] = [];

    festivals.forEach(festival => {
        const [month, day] = festival.date.split('-').map(Number);
        const festivalDate = new Date(today.getFullYear(), month - 1, day);

        // If festival has passed this year, check next year
        if (festivalDate < today) {
            festivalDate.setFullYear(today.getFullYear() + 1);
        }

        const daysUntil = Math.ceil((festivalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil >= 0 && daysUntil <= daysAhead) {
            upcoming.push({ ...festival, year: festivalDate.getFullYear() });
        }
    });

    return upcoming.sort((a, b) => {
        const [aMonth, aDay] = a.date.split('-').map(Number);
        const [bMonth, bDay] = b.date.split('-').map(Number);
        return (aMonth * 100 + aDay) - (bMonth * 100 + bDay);
    });
}

export function getTodaysFestival(): Festival | null {
    const today = new Date();
    const todayString = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return festivals.find(f => f.date === todayString) || null;
}

export function shouldShowGreeting(): { show: boolean; festival: Festival | null } {
    const todayFestival = getTodaysFestival();
    if (todayFestival) {
        return { show: true, festival: todayFestival };
    }

    // Check for festivals within next 3 days
    const upcoming = getUpcomingFestivals(3);
    if (upcoming.length > 0) {
        return { show: true, festival: upcoming[0] };
    }

    return { show: false, festival: null };
}
