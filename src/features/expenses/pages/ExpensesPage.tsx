import React, { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from "../api/expensesApi";
import { Plus, Edit2, Trash2, X, Search, Calendar, FileText, DollarSign, ShieldAlert, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadPDF } from "@/utils/pdfHelper";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function ExpensesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetExpensesQuery();
  const { t, language } = useLanguage();
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const handleDownloadPDF = () => {
    downloadPDF("expenses-table-container", `${user?.tenant?.name || "Mill"}_Expenses_Report`, {
      title: t("expenses"),
      subtitle: t("expenses_desc"),
      tenantName: user?.tenant?.name,
      tenantCode: user?.tenant?.code,
      language: language,
    });
  };

  // Form Fields
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  if (!user) return null;
  const isPartner = user.role === USER_ROLE.PARTNER;

  const records = response?.data || [];
  const filteredRecords = records.filter(
    (r) =>
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    if (isPartner) return;
    setEditingRecord(null);
    setCategory("Electricity Bill");
    setAmount(1000);
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setShowModal(true);
  };

  const handleOpenEdit = (rec: any) => {
    if (isPartner) return;
    setEditingRecord(rec);
    setCategory(rec.category);
    setAmount(rec.amount);
    setDescription(rec.description);
    setDate(rec.date);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPartner || !category || amount <= 0 || !description) return;

    const payload = {
      category,
      amount,
      description,
      date,
    };

    try {
      if (editingRecord) {
        await updateExpense({ id: editingRecord.id, data: payload }).unwrap();
      } else {
        await createExpense(payload).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save expense:", err);
    }
  };

  const handleDelete = (id: string) => {
    if (isPartner) return;
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteExpense(deleteTargetId).unwrap();
    } catch (err) {
      console.error("Failed to delete expense:", err);
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
          <span>Read-only Partner Session: Logging expenses or editing expense data is reserved for the Mill Admin.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("expenses")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("expenses_desc")}
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
            <span className="truncate">{t("add_expense")}</span>
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
        <div className="text-center py-12 text-slate-500 font-medium">Fetching expense records...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 text-center">
          Failed to load expense records.
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
          <DollarSign className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No Expense Records</h3>
          <p className="text-sm text-slate-400 mt-1">No transaction items found matching your filters.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div id="expenses-table-container" className="hidden md:block bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">{t("date")}</th>
                    <th className="px-6 py-4">{t("category")}</th>
                    <th className="px-6 py-4">{t("description")}</th>
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
                      <td className="px-6 py-4 font-bold text-slate-955">{rec.category}</td>
                      <td className="px-6 py-4 text-slate-600 flex items-center space-x-2">
                        <FileText size={14} className="text-slate-400" />
                        <span>{rec.description}</span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-900">
                        Rs. {rec.amount.toLocaleString("en-IN")}
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

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {filteredRecords.map((rec) => (
              <div key={rec.id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{rec.category}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider flex items-center">
                      <Calendar size={12} className="mr-1 text-slate-400" /> {rec.date}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                    Rs. {rec.amount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="text-xs border-t border-b border-slate-50 py-3">
                  <span className="font-bold text-slate-400 uppercase text-[9px] block tracking-wide">{t("description")}</span>
                  <span className="text-slate-700 font-semibold mt-1 block leading-relaxed">{rec.description || "No description configured"}</span>
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
            ))}
          </div>
        </>
      )}

      {/* CRUD Form Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-extrabold text-sm">
                {editingRecord ? "Update Expense Record" : "Log New Expense Item"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("category")}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="Electricity Bill">Electricity Bill</option>
                  <option value="Machine Maintenance">Machine Maintenance</option>
                  <option value="Generator Fuel">Generator Fuel</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Loading Charges">Loading Charges</option>
                  <option value="Land Lease Rent">Land Lease Rent</option>
                  <option value="Taxes & Licenses">Taxes & Licenses</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("amount")}</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
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
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("description")}</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide transaction details e.g. boiler Replacement gaskets & servicing"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none resize-none"
                />
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