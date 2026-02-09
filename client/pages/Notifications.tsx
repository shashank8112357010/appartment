import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Send, Trash2, Check, LogOut, X, Sparkles, Copy } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";

interface Notification {
  id: string;
  flatNumber: string;
  owner: string;
  title: string;
  message: string;
  date: string;
  type: "payment" | "maintenance" | "general" | "urgent";
  read: boolean;
  createdAt: Date;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedApartments, setSelectedApartments] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      navigate("/");
      return;
    }
    setUserRole(role);

    // Load notifications from localStorage
    const stored = localStorage.getItem("notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, [navigate]);

  const apartmentsData: Record<string, string> = {
    "100": "Aman",
    "101": "Rakha Sharma",
    "102": "Manish",
    "103": "Naveen",
    "201": "PB Dangwal",
    "202": "Girish Pandey",
    "203": "Bikram",
    "301": "Girish",
    "302": "Arvind",
    "303": "Chandan",
  };

  const standardMessages = [
    {
      title: "Monthly Maintenance Due",
      message: "Dear Resident, Your monthly maintenance payment of ₹250 for [Month] is due on [Date]. Please make the payment at your earliest convenience. Thank you for your cooperation.",
      type: "payment"
    },
    {
      title: "Urgent: Water Supply Disruption",
      message: "Dear Residents, Please be informed that water supply will be temporarily disrupted on [Date] from [Time] to [Time] due to maintenance work. Kindly store sufficient water. We apologize for the inconvenience.",
      type: "urgent"
    },
    {
      title: "Elevator Maintenance Scheduled",
      message: "Dear Residents, Elevator maintenance is scheduled on [Date] from [Time] to [Time]. Please use the stairs during this period. We apologize for the inconvenience caused.",
      type: "maintenance"
    },
    {
      title: "Society Meeting Notice",
      message: "Dear Residents, A general body meeting is scheduled on [Date] at [Time] in the common area. All residents are requested to attend. Important matters regarding society management will be discussed.",
      type: "general"
    },
    {
      title: "Pending Payment Reminder",
      message: "Dear Resident, We notice that your maintenance payment for [Months] is pending. Total outstanding amount: ₹[Amount]. Please clear the dues at the earliest to avoid any inconvenience.",
      type: "payment"
    },
    {
      title: "Power Backup Maintenance",
      message: "Dear Residents, Generator maintenance will be carried out on [Date] from [Time] to [Time]. Please note that power backup will be unavailable during this period. Plan accordingly.",
      type: "maintenance"
    },
    {
      title: "Pest Control Activity",
      message: "Dear Residents, Professional pest control service will be conducted in common areas on [Date]. Please keep your main doors closed and pets indoors during the activity. Thank you for your cooperation.",
      type: "maintenance"
    },
    {
      title: "Festival Celebration",
      message: "Dear Residents, We are organizing [Festival Name] celebration on [Date] at [Time] in the society premises. All residents are cordially invited to join. Let's celebrate together!",
      type: "general"
    },
    {
      title: "Security Alert",
      message: "Dear Residents, We request all residents to be vigilant and ensure that main gates are properly locked. Please verify the identity of unknown persons before allowing entry. Report any suspicious activity to security immediately.",
      type: "urgent"
    },
    {
      title: "Parking Guidelines Reminder",
      message: "Dear Residents, Please ensure vehicles are parked only in designated parking areas. Vehicles blocking common passages will be towed. Visitor parking is available in the guest parking zone. Thank you for your cooperation.",
      type: "general"
    }
  ];

  const flatNumbers = Object.keys(apartmentsData);

  const handleToggleApartment = (flatNumber: string) => {
    setSelectedApartments(prev =>
      prev.includes(flatNumber)
        ? prev.filter(f => f !== flatNumber)
        : [...prev, flatNumber]
    );
  };

  const handleSelectAll = () => {
    if (selectedApartments.length === flatNumbers.length) {
      setSelectedApartments([]);
    } else {
      setSelectedApartments(flatNumbers);
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedApartments.length === 0 || !formData.title || !formData.message) {
      alert("Please select at least one apartment and fill all fields");
      return;
    }

    // Create notifications for all selected apartments
    const newNotifications: Notification[] = selectedApartments.map(flatNumber => ({
      id: `${Date.now()}-${flatNumber}`,
      flatNumber: flatNumber,
      owner: apartmentsData[flatNumber] || "Unknown",
      title: formData.title,
      message: formData.message,
      date: new Date().toLocaleDateString(),
      type: formData.type as any,
      read: false,
      createdAt: new Date(),
    }));

    const updated = [...newNotifications, ...notifications];
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));

    setFormData({
      title: "",
      message: "",
      type: "general",
    });
    setSelectedApartments([]);
    setShowForm(false);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("flatNumber");
    navigate("/");
  };

  const typeColors = {
    payment: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    maintenance: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    general: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    urgent: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  const userNotifications = userRole === "owner"
    ? notifications.filter((n) => n.flatNumber === localStorage.getItem("flatNumber"))
    : notifications;

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link
                to={userRole === "admin" ? "/admin" : "/owner"}
                className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30 relative">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Notifications
                </h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-red-700 dark:hover:bg-red-500 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Admin Send Notification Button */}
        {userRole === "admin" && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500 shadow-md"
            >
              <Send className="h-4 w-4" />
              Send Notification
            </button>
          </div>
        )}

        {/* Send Notification Modal */}
        {showForm && userRole === "admin" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800">
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Send Notification</h2>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 hover:bg-white/50 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSendNotification} id="notification-form" className="space-y-5">
                  {/* Select Apartments Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                        Select Apartments ({selectedApartments.length} selected)
                      </label>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        {selectedApartments.length === flatNumbers.length ? '✓ Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto">
                      {flatNumbers.map((flat) => (
                        <label
                          key={flat}
                          className={`flex items-center gap-2 p-2.5 rounded-md cursor-pointer transition-all ${selectedApartments.includes(flat)
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 shadow-sm'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600'
                            } hover:border-blue-400 hover:shadow-sm`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedApartments.includes(flat)}
                            onChange={() => handleToggleApartment(flat)}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              Flat {flat}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {apartmentsData[flat]}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>

                  </div>

                  {/* Notification Type */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Notification Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">📢 General</option>
                      <option value="payment">💰 Payment Due</option>
                      <option value="maintenance">🔧 Maintenance</option>
                      <option value="urgent">⚠️ Urgent</option>
                    </select>
                  </div>

                  {/* AI Standard Templates */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      AI Quick Templates
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900/50 dark:to-slate-900/50 rounded-lg border border-purple-200 dark:border-slate-700">
                      {standardMessages.map((template, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              title: template.title,
                              message: template.message,
                              type: template.type
                            });
                          }}
                          className="text-left p-2.5 rounded-md border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 hover:border-purple-400 hover:shadow-md transition-all text-xs group"
                        >
                          <div className="flex items-start gap-2">
                            <Copy className="h-3.5 w-3.5 text-purple-400 group-hover:text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                              {template.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Click any template to auto-fill. Edit placeholders like [Date], [Time] before sending.
                    </p>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Monthly Maintenance Due"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Enter notification message..."
                      rows={5}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-semibold transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  form="notification-form"
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 text-sm font-semibold flex items-center gap-2 shadow-md transition-all hover:shadow-lg"
                >
                  <Send className="h-4 w-4" />
                  Send to {selectedApartments.length} Apartment{selectedApartments.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="rounded-xl bg-white shadow-sm dark:bg-slate-800">
          <div className="border-b border-slate-200 px-4 sm:px-6 py-4 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {userRole === "admin" ? "All Notifications" : "Your Notifications"}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {userNotifications.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <Bell className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No notifications yet
                </p>
              </div>
            ) : (
              userNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 sm:p-6 transition-colors ${notification.read
                    ? "bg-white dark:bg-slate-800"
                    : "bg-blue-50 dark:bg-blue-900/20"
                    }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                {notification.title}
                              </h3>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                Flat {notification.flatNumber} • {notification.owner}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            {notification.date}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${typeColors[notification.type]
                          }`}
                      >
                        {notification.type}
                      </span>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="rounded p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav role={userRole as "admin" | "owner"} unreadCount={unreadCount} onLogout={handleLogout} />
    </div>
  );
}
