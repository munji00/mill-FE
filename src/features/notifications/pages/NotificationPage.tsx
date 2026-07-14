import { useAppSelector } from "@/app/store/hooks";
import { useGetNotificationsQuery, useMarkAsReadMutation } from "../api/notificationApi";
import { Bell, Check, MessageSquare, Clock } from "lucide-react";

export default function NotificationPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  if (!user) return null;

  const notifications = response?.data || [];

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications & Broadcasts Audit</h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical ledger of changes made by the Admin and automated WhatsApp broadcast alerts dispatched to partners.
        </p>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Fetching notifications log...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 text-center">
          Failed to load notifications log.
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
          <Bell className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No Notifications</h3>
          <p className="text-sm text-slate-400 mt-1">Your notification box is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((not) => (
            <div
              key={not.id}
              className={`p-5 rounded-xl border transition shadow-sm bg-white flex flex-col md:flex-row md:items-start justify-between space-y-4 md:space-y-0 ${
                not.read ? "border-slate-150 opacity-75" : "border-blue-100 bg-blue-50/10"
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Badge Icon depending on message */}
                <div
                  className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                    not.read ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <Bell size={18} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {not.module}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center">
                      <Clock size={12} className="mr-1" />
                      {new Date(not.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {not.message}
                  </p>

                  {/* WhatsApp Simulation status */}
                  {not.whatsappSent && (
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-3 flex items-start space-x-2.5 mt-2">
                      <MessageSquare className="text-emerald-600 shrink-0 mt-0.5" size={14} />
                      <div className="text-[11px] text-emerald-800 space-y-1 leading-relaxed">
                        <span className="font-extrabold uppercase tracking-wide text-emerald-900 block">
                          Simulated WhatsApp Dispatch Status:
                        </span>
                        <p className="font-mono text-emerald-700 select-all">
                          {not.whatsappMessageDetails}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {!not.read && (
                <button
                  onClick={() => handleMarkAsRead(not.id)}
                  className="flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition shrink-0 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
