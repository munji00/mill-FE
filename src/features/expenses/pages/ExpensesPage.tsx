import React, { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from "../api/expensesApi";
import { Plus, DollarSign, ShieldAlert, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadPDF } from "@/utils/pdfHelper";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { ExpensesFilters } from "../components/ExpensesFilters";
import { ExpensesTable } from "../components/ExpensesTable";
import { ExpensesFormModal } from "../components/ExpensesFormModal";

export default function ExpensesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetExpensesQuery();
  const { t, language } = useLanguage();
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // Active filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Draft filter states
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");
  const [draftSelectedCategory, setDraftSelectedCategory] = useState("");
  const [draftMinAmount, setDraftMinAmount] = useState("");
  const [draftMaxAmount, setDraftMaxAmount] = useState("");

  // Form Fields
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  if (!user) return null;
  const isPartner = user.role === USER_ROLE.PARTNER;

  const records = response?.data || [];

  // Compute unique categories for dropdown
  const uniqueCategories = Array.from(new Set(records.map((r: any) => r.category))).filter(Boolean);

  const filteredRecords = records.filter((r: any) => {
    // 1. Date Range Filter
    if (startDate && r.date < startDate) return false;
    if (endDate && r.date > endDate) return false;

    // 2. Category Filter
    if (selectedCategory && r.category !== selectedCategory) return false;

    // 3. Amount Filter
    const val = r.amount || 0;
    if (minAmount && val < parseFloat(minAmount)) return false;
    if (maxAmount && val > parseFloat(maxAmount)) return false;

    return true;
  });

  const handleDownloadPDF = () => {
    downloadPDF("expenses-table-container", `${user?.tenant?.name || "Mill"}_Expenses_Report`, {
      title: t("expenses"),
      subtitle: t("expenses_desc"),
      tenantName: user?.tenant?.name,
      tenantCode: user?.tenant?.code,
      language: language,
    });
  };

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
      <ExpensesFilters
        draftStartDate={draftStartDate}
        setDraftStartDate={setDraftStartDate}
        draftEndDate={draftEndDate}
        setDraftEndDate={setDraftEndDate}
        draftSelectedCategory={draftSelectedCategory}
        setDraftSelectedCategory={setDraftSelectedCategory}
        draftMinAmount={draftMinAmount}
        setDraftMinAmount={setDraftMinAmount}
        draftMaxAmount={draftMaxAmount}
        setDraftMaxAmount={setDraftMaxAmount}
        startDate={startDate}
        endDate={endDate}
        selectedCategory={selectedCategory}
        minAmount={minAmount}
        maxAmount={maxAmount}
        uniqueCategories={uniqueCategories}
        onApplyFilters={() => {
          setStartDate(draftStartDate);
          setEndDate(draftEndDate);
          setSelectedCategory(draftSelectedCategory);
          setMinAmount(draftMinAmount);
          setMaxAmount(draftMaxAmount);
        }}
        onClearFilters={() => {
          setStartDate("");
          setEndDate("");
          setSelectedCategory("");
          setMinAmount("");
          setMaxAmount("");

          setDraftStartDate("");
          setDraftEndDate("");
          setDraftSelectedCategory("");
          setDraftMinAmount("");
          setDraftMaxAmount("");
        }}
      />

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
        <ExpensesTable
          filteredRecords={filteredRecords}
          isPartner={isPartner}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* CRUD Form Dialog Modal */}
      <ExpensesFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingRecord={editingRecord}
        onSave={handleSave}
        category={category}
        setCategory={setCategory}
        amount={amount}
        setAmount={setAmount}
        description={description}
        setDescription={setDescription}
        date={date}
        setDate={setDate}
        isSaving={isCreating || isUpdating}
      />

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