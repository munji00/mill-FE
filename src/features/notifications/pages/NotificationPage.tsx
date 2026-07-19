import { useAppSelector } from "@/app/store/hooks";
import { useGetNotificationsQuery, useMarkAsReadMutation } from "../api/notificationApi";
import { Bell, Check, MessageSquare, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotificationPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const { t } = useLanguage();

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
        <h1 className="text-2xl font-bold text-slate-900">{t("notifications_audit")}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("notifications_audit_desc")}
        </p>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">{t("fetching_notifications")}</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 text-center">
          {t("failed_notifications")}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
          <Bell className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">{t("no_notifications")}</h3>
          <p className="text-sm text-slate-400 mt-1">{t("no_notifications_desc")}</p>
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
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-4 flex items-start space-x-2.5 mt-2 w-full">
                      <MessageSquare className="text-emerald-600 shrink-0 mt-0.5" size={14} />
                      <div className="text-[11px] text-emerald-800 space-y-1.5 leading-relaxed w-full">
                        <span className="font-extrabold uppercase tracking-wide text-emerald-900 block">
                          {t("wa_dispatch_status")}:
                        </span>
                        {(() => {
                          const details = not.whatsappMessageDetails || "";
                          const marker = "Record payload: ";
                          const markerIndex = details.indexOf(marker);
                          if (markerIndex === -1) {
                            return <p className="font-mono text-emerald-700 select-all">{details}</p>;
                          }

                          const prefix = details.substring(0, markerIndex).trim();
                          const jsonStr = details.substring(markerIndex + marker.length).trim();
                          
                          let payloadObj: any = null;
                          try {
                            payloadObj = JSON.parse(jsonStr);
                          } catch (e) {
                            return (
                              <div className="space-y-1">
                                <p className="text-slate-600 font-semibold">{prefix}</p>
                                <p className="font-mono text-emerald-700 select-all">{jsonStr}</p>
                              </div>
                            );
                          }

                          const technicalKeys = ["id", "tenantId", "createdAt", "updatedAt", "isActive", "status"];
                          const displayRows = Object.entries(payloadObj).filter(
                            ([key]) => !technicalKeys.includes(key)
                          );

                          if (displayRows.length === 0) {
                            return <p className="text-slate-600 font-semibold">{prefix}</p>;
                          }

                          const getTranslationKey = (jsonKey: string): string => {
                            const mapping: { [key: string]: string } = {
                              itemName: "item_name",
                              quantity: "quantity",
                              unit: "unit",
                              pricePerUnit: "price_per_unit",
                              supplierName: "supplier_name",
                              buyerName: "buyer_name",
                              date: "date",
                              category: "category",
                              amount: "amount",
                              description: "description",
                              dailyWage: "wage",
                              presentDays: "present_days",
                              unpaidDues: "unpaid_dues",
                              contactNumber: "contact",
                              minStockAlert: "min_stock_alert",
                              stockQuantity: "stock_quantity",
                              name: "item_name",
                              role: "designation",
                              email: "email_address",
                              state: "state",
                              city: "city",
                              townOrVillage: "town_village",
                            };
                            return mapping[jsonKey] || jsonKey;
                          };

                          const humanizeKey = (key: string) => {
                            const result = key.replace(/([A-Z])/g, " $1");
                            return result.charAt(0).toUpperCase() + result.slice(1);
                          };

                          const translateKey = (jsonKey: string) => {
                            const key = getTranslationKey(jsonKey);
                            const translated = t(key);
                            return translated === key ? humanizeKey(jsonKey) : translated;
                          };

                           return (
                            <div className="space-y-3 w-full">
                              <p className="text-slate-700 font-semibold text-xs">{prefix}</p>
                              <div className="border border-emerald-100 rounded-xl bg-white max-w-md shadow-sm divide-y divide-slate-100 overflow-hidden">
                                {displayRows.map(([key, val]: any) => (
                                  <div key={key} className="flex justify-between items-center px-4 py-2.5 text-[11px] sm:text-xs">
                                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">{translateKey(key)}</span>
                                    <span className="font-mono text-slate-800 select-all font-bold">
                                      {typeof val === "number" &&
                                      (key.toLowerCase().includes("price") ||
                                        key.toLowerCase().includes("wage") ||
                                        key.toLowerCase().includes("amount") ||
                                        key.toLowerCase().includes("due"))
                                        ? `Rs. ${val.toLocaleString("en-IN")}`
                                        : String(val)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
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
                  <span>{t("mark_read")}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
