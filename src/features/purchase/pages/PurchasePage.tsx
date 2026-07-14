import React, { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import {
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} from "../api/purchaseApi";
import { Plus, Edit2, Trash2, X, Search, Calendar, Landmark, ShoppingBag, ShieldAlert, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadPDF } from "@/utils/pdfHelper";

export default function PurchasePage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetPurchasesQuery();
  const { t, language } = useLanguage();
  const [createPurchase, { isLoading: isCreating }] = useCreatePurchaseMutation();
  const [updatePurchase, { isLoading: isUpdating }] = useUpdatePurchaseMutation();
  const [deletePurchase] = useDeletePurchaseMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const handleDownloadPDF = () => {
    downloadPDF("purchases-table-container", `${user?.tenant?.name || "Mill"}_Purchases_Report`, {
      title: t("purchases"),
      subtitle: t("purchases_desc"),
      tenantName: user?.tenant?.name,
      tenantCode: user?.tenant?.code,
      language: language,
    });
  };

  // Form Fields
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState("Bags");
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [supplierName, setSupplierName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  if (!user) return null;
  const isPartner = user.role === USER_ROLE.PARTNER;

  const records = response?.data || [];
  const filteredRecords = records.filter(
    (r) =>
      r.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    if (isPartner) return;
    setEditingRecord(null);
    setItemName("Paddy Raw Basmati (1121)");
    setQuantity(100);
    setUnit("Bags");
    setPricePerUnit(2200);
    setSupplierName("");
    setDate(new Date().toISOString().split("T")[0]);
    setShowModal(true);
  };

  const handleOpenEdit = (rec: any) => {
    if (isPartner) return;
    setEditingRecord(rec);
    setItemName(rec.itemName);
    setQuantity(rec.quantity);
    setUnit(rec.unit);
    setPricePerUnit(rec.pricePerUnit);
    setSupplierName(rec.supplierName);
    setDate(rec.date);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPartner || !itemName || quantity <= 0 || pricePerUnit <= 0 || !supplierName) return;

    const payload = {
      itemName,
      quantity,
      unit,
      pricePerUnit,
      totalAmount: quantity * pricePerUnit,
      supplierName,
      date,
    };

    try {
      if (editingRecord) {
        await updatePurchase({ id: editingRecord.id, data: payload }).unwrap();
      } else {
        await createPurchase(payload).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save purchase:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (isPartner) return;
    if (confirm("Are you sure you want to delete this purchase transaction?")) {
      try {
        await deletePurchase(id).unwrap();
      } catch (err) {
        console.error("Failed to delete purchase:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Read Only Warn Banner */}
      {isPartner && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-center space-x-3 text-xs font-semibold">
          <ShieldAlert className="text-amber-600 shrink-0" size={18} />
          <span>Read-only Partner Session: Logging purchases or editing inventory transactions is reserved for the Mill Admin.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("purchases")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("purchases_desc")}
          </p>
        </div>
        <div className="flex space-x-3 items-center">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
          >
            <Download size={18} />
            <span>{t("download_report")}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            disabled={isPartner}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold transition cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            <span>{t("add_purchase")}</span>
          </button>
        </div>
      </div>

      {/* Table Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full pl-10 rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Interactive Table List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Fetching purchase history...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 text-center">
          Failed to load purchase records.
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
          <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No Purchase Records</h3>
          <p className="text-sm text-slate-400 mt-1">No transaction items found matching your filters.</p>
        </div>
      ) : (
        <div id="purchases-table-container" className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">{t("date")}</th>
                  <th className="px-6 py-4">{t("item_name")}</th>
                  <th className="px-6 py-4">{t("supplier_name")}</th>
                  <th className="px-6 py-4">{t("quantity")} / {t("unit")}</th>
                  <th className="px-6 py-4">{t("price_per_unit")}</th>
                  <th className="px-6 py-4">{t("amount")}</th>
                  {!isPartner && <th className="px-6 py-4 text-right">{t("actions")}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-semibold text-slate-600 flex items-center space-x-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{rec.date}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{rec.itemName}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center space-x-2">
                      <Landmark size={14} className="text-slate-400" />
                      <span>{rec.supplierName}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-700">
                      {rec.quantity} <span className="text-xs text-slate-400 font-sans">{rec.unit}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      Rs. {rec.pricePerUnit}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      Rs. {rec.totalAmount.toLocaleString("en-IN")}
                    </td>
                    {!isPartner && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(rec)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Form Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-extrabold text-sm">
                {editingRecord ? "Update Purchase Log" : "Log New Intake Transaction"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("item_name")}</label>
                <select
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="Paddy Raw Basmati (1121)">Paddy Raw Basmati (1121)</option>
                  <option value="Sona Masuri Paddy">Sona Masuri Paddy</option>
                  <option value="White Rice Husk Bags">White Rice Husk Bags</option>
                  <option value="Premium Paddy Seeds">Premium Paddy Seeds</option>
                  <option value="Diesel Generator Fuel">Diesel Generator Fuel</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("quantity")}</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("unit")}</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Bags">Bags</option>
                    <option value="Tons">Tons</option>
                    <option value="Quintals">Quintals</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Liters">Liters</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("price_per_unit")}</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("date")}</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("supplier_name")}</label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. Punjab Agro Cooperative"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase">Estimated Total Cost:</span>
                <span className="font-mono font-extrabold text-sm text-slate-900">
                  Rs. {(quantity * pricePerUnit).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition shadow-md shadow-blue-500/20"
                >
                  {isCreating || isUpdating ? "Logging..." : editingRecord ? t("save_changes") : t("save_changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}