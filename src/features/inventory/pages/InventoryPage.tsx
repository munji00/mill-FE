import React, { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import {
  useGetInventoryQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} from "../api/inventoryApi";
import { Plus, Edit2, Trash2, X, Search, Layers, ShieldAlert, AlertCircle, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadPDF } from "@/utils/pdfHelper";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function InventoryPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetInventoryQuery();
  const { t, language } = useLanguage();
  const [createInventory, { isLoading: isCreating }] = useCreateInventoryMutation();
  const [updateInventory, { isLoading: isUpdating }] = useUpdateInventoryMutation();
  const [deleteInventory, { isLoading: isDeleting }] = useDeleteInventoryMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const handleDownloadPDF = () => {
    downloadPDF("inventory-table-container", `${user?.tenant?.name || "Mill"}_Inventory_Report`, {
      title: t("inventory"),
      subtitle: t("inventory_desc"),
      tenantName: user?.tenant?.name,
      tenantCode: user?.tenant?.code,
      language: language,
    });
  };

  // Form Fields
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<"Raw Material" | "Finished Goods" | "Packaging" | "Byproduct">("Raw Material");
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [unit, setUnit] = useState("Bags");
  const [minStockAlert, setMinStockAlert] = useState<number>(0);

  if (!user) return null;
  const isPartner = user.role === USER_ROLE.PARTNER;

  const records = response?.data || [];
  const filteredRecords = records.filter(
    (r) =>
      r.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    if (isPartner) return;
    setEditingRecord(null);
    setItemName("");
    setCategory("Raw Material");
    setStockQuantity(100);
    setUnit("Bags");
    setMinStockAlert(20);
    setShowModal(true);
  };

  const handleOpenEdit = (rec: any) => {
    if (isPartner) return;
    setEditingRecord(rec);
    setItemName(rec.itemName);
    setCategory(rec.category);
    setStockQuantity(rec.stockQuantity);
    setUnit(rec.unit);
    setMinStockAlert(rec.minStockAlert);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPartner || !itemName || !category || stockQuantity < 0 || minStockAlert < 0) return;

    const payload = {
      itemName,
      category,
      stockQuantity,
      unit,
      minStockAlert,
    };

    try {
      if (editingRecord) {
        await updateInventory({ id: editingRecord.id, data: payload }).unwrap();
      } else {
        await createInventory(payload).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save inventory item:", err);
    }
  };

  const handleDelete = (id: string) => {
    if (isPartner) return;
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteInventory(deleteTargetId).unwrap();
    } catch (err) {
      console.error("Failed to delete inventory item:", err);
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Read Only Warn Banner */}
      {isPartner && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-center space-x-3 text-xs font-semibold">
          <ShieldAlert className="text-amber-600 shrink-0" size={18} />
          <span>Read-only Partner Session: Adding stock categories or updating inventory levels is reserved for the Mill Admin.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("inventory")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("inventory_desc")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:space-x-3 sm:w-auto items-center">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer text-xs sm:text-sm w-full sm:w-auto"
          >
            <Download size={16} className="shrink-0" />
            <span className="truncate">{t("download_report")}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            disabled={isPartner}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold transition cursor-pointer disabled:cursor-not-allowed text-xs sm:text-sm w-full sm:w-auto"
          >
            <Plus size={16} className="shrink-0" />
            <span className="truncate">{t("add_inventory")}</span>
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
        <div className="text-center py-12 text-slate-500 font-medium">Fetching inventory list...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 text-center">
          Failed to load inventory stocks.
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
          <Layers className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No Inventory Items</h3>
          <p className="text-sm text-slate-400 mt-1">No items found matching your filter criteria.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div id="inventory-table-container" className="hidden md:block bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">{t("item_name")}</th>
                    <th className="px-6 py-4">{t("category")}</th>
                    <th className="px-6 py-4">{t("stock_quantity")}</th>
                    <th className="px-6 py-4">{t("min_stock_alert")}</th>
                    <th className="px-6 py-4">Status Alert</th>
                    {!isPartner && <th className="px-6 py-4 text-right">{t("actions")}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredRecords.map((rec) => {
                    const isLowStock = rec.stockQuantity <= rec.minStockAlert;
                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4 font-bold text-slate-900">{rec.itemName}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {rec.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-800">
                          {rec.stockQuantity} <span className="text-xs text-slate-400 font-sans">{rec.unit}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">
                          {rec.minStockAlert} <span className="text-xs text-slate-400 font-sans">{rec.unit}</span>
                        </td>
                        <td className="px-6 py-4">
                          {isLowStock ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-100 animate-pulse">
                              <AlertCircle size={10} className="mr-1" />
                              Low Stock Alert
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Normal
                            </span>
                          )}
                        </td>
                        {!isPartner && (
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleOpenEdit(rec)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title="Edit Item"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(rec.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Delete Item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {filteredRecords.map((rec) => {
              const isLowStock = rec.stockQuantity <= rec.minStockAlert;
              return (
                <div key={rec.id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{rec.itemName}</h4>
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 mt-1">
                        {rec.category}
                      </span>
                    </div>
                    {isLowStock ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-100 animate-pulse">
                        <AlertCircle size={10} className="mr-1" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Normal
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-slate-50 py-3">
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[9px] block tracking-wide">{t("stock_quantity")}</span>
                      <span className="text-slate-700 font-semibold mt-1 block font-mono">
                        {rec.stockQuantity} <span className="text-[10px] text-slate-400 font-sans">{rec.unit}</span>
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[9px] block tracking-wide">{t("min_stock_alert")}</span>
                      <span className="text-slate-700 font-semibold mt-1 block font-mono">
                        {rec.minStockAlert} <span className="text-[10px] text-slate-400 font-sans">{rec.unit}</span>
                      </span>
                    </div>
                  </div>

                  {!isPartner && (
                    <div className="flex justify-end space-x-3 pt-1">
                      <button
                        onClick={() => handleOpenEdit(rec)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-xs font-bold transition cursor-pointer border border-slate-100 hover:border-blue-100"
                      >
                        <Edit2 size={14} />
                        <span>{t("edit")}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg text-xs font-bold transition cursor-pointer border border-slate-100 hover:border-red-100"
                      >
                        <Trash2 size={14} />
                        <span>{t("delete")}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CRUD Form Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-extrabold text-sm">
                {editingRecord ? "Edit Stock Item" : "Register Stock Item"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("item_name")}</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Haryana Paddy 1121 Raw"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("category")}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Raw Material">Raw Material</option>
                    <option value="Finished Goods">Finished Goods</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Byproduct">Byproduct</option>
                  </select>
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
                    <option value="Barrels">Barrels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("stock_quantity")}</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("min_stock_alert")}</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
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
                  {isCreating || isUpdating ? "Saving..." : editingRecord ? t("save_changes") : t("save_changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title={t("confirm_delete_title")}
        message={t("confirm_delete_msg")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        isConfirming={isDeleting}
      />
    </div>
  );
}