import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Send, Trash2, Check, LogOut, X, Sparkles, Copy, RefreshCw } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import api from "@/lib/api";

interface Notification {
  id: string;
  flatId?: number;
  flatNumber?: string;
  owner?: string;
  title: string;
  message: string;
  type: "payment" | "maintenance" | "general" | "urgent" | "festival";
  read: boolean;
  sendToAll: boolean;
  createdAt: string;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedApartments, setSelectedApartments] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
  });

  const apartmentsData: Record<string, string> = {
    "100": "Aman",
    "101": "Sharma Ji",
    "102": "Manish Tomar",
    "103": "Naveen",
    "201": "Dangwal",
    "202": "Girish Pandey",
    "203": "Bikram",
    "301": "Girish",
    "302": "Arvind",
    "303": "Chandan",
  };

  const loadNotifications = async () => {
    try {
      const flat = userRole === "owner" ? parseInt(flatNumber) : undefined;
      const data = await api.getNotifications(flat);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const flat = localStorage.getItem("flatNumber") || "";
    if (!role) {
      navigate("/");
      return;
    }
    setUserRole(role);
    setFlatNumber(flat);
  }, [navigate]);

  useEffect(() => {
    if (userRole) {
      loadNotifications();
    }
  }, [userRole, flatNumber]);

  const standardMessages = [
    { title: "Monthly Maintenance Due", message: "Dear Resident, Your monthly maintenance payment of ₹250 for [Month] is due on [Date]. Please make the payment at your earliest convenience. Thank you for your cooperation.", type: "payment" },
    { title: "Urgent: Water Supply Disruption", message: "Dear Residents, Please be informed that water supply will be temporarily disrupted on [Date] from [Time] to [Time] due to maintenance work. Kindly store sufficient water. We apologize for the inconvenience.", type: "urgent" },
    { title: "Elevator Maintenance Scheduled", message: "Dear Residents, Elevator maintenance is scheduled on [Date] from [Time] to [Time]. Please use the stairs during this period. We apologize for the inconvenience caused.", type: "maintenance" },
    { title: "Society Meeting Notice", message: "Dear Residents, A general body meeting is scheduled on [Date] at [Time] in the common area. All residents are requested to attend. Important matters regarding society management will be discussed.", type: "general" },
    { title: "Pending Payment Reminder", message: "Dear Resident, We notice that your maintenance payment for [Months] is pending. Total outstanding amount: ₹[Amount]. Please clear the dues at the earliest to avoid any inconvenience.", type: "payment" },
    { title: "Power Backup Maintenance", message: "Dear Residents, Generator maintenance will be carried out on [Date] from [Time] to [Time]. Please note that power backup will be unavailable during this period. Plan accordingly.", type: "maintenance" },
    { title: "Pest Control Activity", message: "Dear Residents, Professional pest control service will be conducted in common areas on [Date]. Please keep your main doors closed and pets indoors during the activity. Thank you for your cooperation.", type: "maintenance" },
    { title: "Festival Celebration", message: "Dear Residents, We are organizing [Festival Name] celebration on [Date] at [Time] in the society premises. All residents are cordially invited to join. Let's celebrate together!", type: "general" },
    { title: "Security Alert", message: "Dear Residents, We request all residents to be vigilant and ensure that main gates are properly locked. Please verify the identity of unknown persons before allowing entry. Report any suspicious activity to security immediately.", type: "urgent" },
    { title: "Parking Guidelines Reminder", message: "Dear Residents, Please ensure vehicles are parked only in designated parking areas. Vehicles blocking common passages will be towed. Visitor parking is available in the guest parking zone. Thank you for your cooperation.", type: "general" }
  ];

  const flatNumbers = Object.keys(apartmentsData);

  const handleToggleApartment = (flat: string) => {
    setSelectedApartments(prev =>
      prev.includes(flat) ? prev.filter(f => f !== flat) : [...prev, flat]
    );
  };

  const handleSelectAll = () => {
    if (selectedApartments.length === flatNumbers.length) {
      setSelectedApartments([]);
    } else {
      setSelectedApartments(flatNumbers);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedApartments.length === 0 || !formData.title || !formData.message) {
      alert("Please select at least one apartment and fill all fields");
      return;
    }

    try {
      const sendToAll = selectedApartments.length === flatNumbers.length;

      for (const flat of selectedApartments) {
        await api.addNotification({
          flatId: parseInt(flat),
          flatNumber: flat,
          owner: apartmentsData[flat] || "Unknown",
          title: formData.title,
          message: formData.message,
          type: formData.type,
          sendToAll,
        });
      }

      await loadNotifications();
      setFormData({ title: "", message: "", type: "general" });
      setSelectedApartments([]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to send notification:", error);
      alert("Failed to send notification");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.updateNotification(id, { read: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("flatNumber");
    navigate("/");
  };

  const typeColors: Record<string, string> = {
    payment: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    maintenance: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    general: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    urgent: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    festival: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
            <div className="flex items-center gap-2">
              <button
                onClick={loadNotifications}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <RefreshCw className="h-5 w-5 text-slate-500" />
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-red-700 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
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
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-md"
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
              <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Send Notification</h2>
                </div>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSendNotification} id="notification-form" className="space-y-5">
                  {/* Select Apartments */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                        Select Apartments ({selectedApartments.length} selected)
                      </label>
                      <button type="button" onClick={handleSelectAll} className="text-xs text-blue-600 font-semibold">
                        {selectedApartments.length === flatNumbers.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg max-h-48 overflow-y-auto">
                      {flatNumbers.map((flat) => (
                        <label
                          key={flat}
                          className={`flex items-center gap-2 p-2.5 rounded-md cursor-pointer ${selectedApartments.includes(flat) ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600'}`}
                        >
                          <input type="checkbox" checked={selectedApartments.includes(flat)} onChange={() => handleToggleApartment(flat)} className="w-4 h-4 rounded" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">Flat {flat}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{apartmentsData[flat]}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                      <option value="general">General</option>
                      <option value="payment">Payment Due</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="urgent">Urgent</option>
                      <option value="festival">Festival</option>
                    </select>
                  </div>

                  {/* Templates */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" /> Quick Templates
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-3 bg-purple-50 dark:bg-slate-900/50 rounded-lg">
                      {standardMessages.map((template, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setFormData({ ...formData, title: template.title, message: template.message, type: template.type })}
                          className="text-left p-2 rounded-md border bg-white dark:bg-slate-800 hover:border-purple-400 text-xs"
                        >
                          <Copy className="h-3 w-3 text-purple-400 inline mr-1" />
                          {template.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title & Message */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Notification title" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Message</label>
                    <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Notification message..." rows={4} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                  </div>
                </form>
              </div>

              <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm font-semibold">Close</button>
                <button type="submit" form="notification-form" className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send to {selectedApartments.length} Apartments
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
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{unreadCount} unread</p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className={`p-4 sm:p-6 ${notification.read ? "" : "bg-blue-50 dark:bg-blue-900/20"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />}
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                          {notification.flatNumber && (
                            <p className="text-xs text-slate-500 mt-1">Flat {notification.flatNumber} • {notification.owner}</p>
                          )}
                          <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{notification.message}</p>
                          <p className="text-xs text-slate-500 mt-2">{new Date(notification.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${typeColors[notification.type] || typeColors.general}`}>
                        {notification.type}
                      </span>
                      {!notification.read && (
                        <button onClick={() => markAsRead(notification.id)} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Mark as read">
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => deleteNotification(notification.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <MobileBottomNav role={userRole as "admin" | "owner"} unreadCount={unreadCount} onLogout={handleLogout} />
    </div>
  );
}
