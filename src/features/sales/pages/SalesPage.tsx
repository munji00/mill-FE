import React, { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import {
  useGetSalesQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} from "../api/salesApi";
import { Plus, ShoppingBag, ShieldAlert, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadPDF } from "@/utils/pdfHelper";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { SalesFilters } from "../components/SalesFilters";
import { SalesTable } from "../components/SalesTable";
import { SalesFormModal } from "../components/SalesFormModal";

export default function SalesPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetSalesQuery();
  const { t, language } = useLanguage();
  const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();
  const [updateSale, { isLoading: isUpdating }] = useUpdateSaleMutation();
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // Active filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedBuyerName, setSelectedBuyerName] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Draft filter states
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");
  const [draftSelectedItemName, setDraftSelectedItemName] = useState("");
  const [draftSelectedBuyerName, setDraftSelectedBuyerName] = useState("");
  const [draftMinAmount, setDraftMinAmount] = useState("");
  const [draftMaxAmount, setDraftMaxAmount] = useState("");

  // Form Fields
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState("Bags");
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [buyerName, setBuyerName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  if (!user) return null;
  const isPartner = user.role === USER_ROLE.PARTNER;

  const records = response?.data || [];

  // Compute unique items and buyers for filters
  const uniqueItems = Array.from(new Set(records.map((r: any) => r.itemName))).filter(Boolean);
  const uniqueBuyers = Array.from(new Set(records.map((r: any) => r.buyerName))).filter(Boolean);

  const filteredRecords = records.filter((r: any) => {
    // 1. Date Range Filter
    if (startDate && r.date < startDate) return false;
    if (endDate && r.date > endDate) return false;

    // 2. Item Name Filter
    if (selectedItemName && r.itemName !== selectedItemName) return false;

    // 3. Buyer Name Filter
    if (selectedBuyerName && r.buyerName !== selectedBuyerName) return false;

    // 4. Amount Filter
    const amount = r.totalAmount || 0;
    if (minAmount && amount < parseFloat(minAmount)) return false;
    if (maxAmount && amount > parseFloat(maxAmount)) return false;

    return true;
  });

  const handleDownloadPDF = () => {
    downloadPDF("sales-table-container", `${user?.tenant?.name || "Mill"}_Sales_Report`, {
      title: t("sales"),
      subtitle: t("sales_desc"),
      tenantName: user?.tenant?.name,
      tenantCode: user?.tenant?.code,
      language: language,
    });
  };

  const handleOpenAdd = () => {
    if (isPartner) return;
    setEditingRecord(null);
    setItemName("Premium Basmati Rice XL");
    setQuantity(100);
    setUnit("Bags");
    setPricePerUnit(3500);
    setBuyerName("");
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
    setBuyerName(rec.buyerName);
    setDate(rec.date);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPartner || !itemName || quantity <= 0 || pricePerUnit <= 0 || !buyerName) return;

    const payload = {
      itemName,
      quantity,
      unit,
      pricePerUnit,
      totalAmount: quantity * pricePerUnit,
      buyerName,
      date,
    };

    try {
      if (editingRecord) {
        await updateSale({ id: editingRecord.id, data: payload }).unwrap();
      } else {
        await createSale(payload).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save sale:", err);
    }
  };

  const handleDelete = (id: string) => {
    if (isPartner) return;
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteSale(deleteTargetId).unwrap();
    } catch (err) {
      console.error("Failed to delete sale:", err);
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
          <span>Read-only Partner Session: Logging sales or editing transaction history is reserved for the Mill Admin.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("sales")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("sales_desc")}
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
            <span className="truncate">{t("add_sale")}</span>
          </button>
        </div>
      </div>

      {/* Table Filters */}
      <SalesFilters
        draftStartDate={draftStartDate}
        setDraftStartDate={setDraftStartDate}
        draftEndDate={draftEndDate}
        setDraftEndDate={setDraftEndDate}
        draftSelectedItemName={draftSelectedItemName}
        setDraftSelectedItemName={setDraftSelectedItemName}
        draftSelectedBuyerName={draftSelectedBuyerName}
        setDraftSelectedBuyerName={setDraftSelectedBuyerName}
        draftMinAmount={draftMinAmount}
        setDraftMinAmount={setDraftMinAmount}
        draftMaxAmount={draftMaxAmount}
        setDraftMaxAmount={setDraftMaxAmount}
        startDate={startDate}
        endDate={endDate}
        selectedItemName={selectedItemName}
        selectedBuyerName={selectedBuyerName}
        minAmount={minAmount}
        maxAmount={maxAmount}
        uniqueItems={uniqueItems}
        uniqueBuyers={uniqueBuyers}
        onApplyFilters={() => {
          setStartDate(draftStartDate);
          setEndDate(draftEndDate);
          setSelectedItemName(draftSelectedItemName);
          setSelectedBuyerName(draftSelectedBuyerName);
          setMinAmount(draftMinAmount);
          setMaxAmount(draftMaxAmount);
        }}
        onClearFilters={() => {
          setStartDate("");
          setEndDate("");
          setSelectedItemName("");
          setSelectedBuyerName("");
          setMinAmount("");
          setMaxAmount("");

          setDraftStartDate("");
          setDraftEndDate("");
          setDraftSelectedItemName("");
          setDraftSelectedBuyerName("");
          setDraftMinAmount("");
          setDraftMaxAmount("");
        }}
      />

      {/* Interactive Table List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Fetching sales records...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 text-center">
          Failed to load sales records.
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
          <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No Sales Records</h3>
          <p className="text-sm text-slate-400 mt-1">No transaction items found matching your filters.</p>
        </div>
      ) : (
        <SalesTable
          filteredRecords={filteredRecords}
          isPartner={isPartner}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* CRUD Form Dialog Modal */}
      <SalesFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingRecord={editingRecord}
        onSave={handleSave}
        itemName={itemName}
        setItemName={setItemName}
        quantity={quantity}
        setQuantity={setQuantity}
        unit={unit}
        setUnit={setUnit}
        pricePerUnit={pricePerUnit}
        setPricePerUnit={setPricePerUnit}
        buyerName={buyerName}
        setBuyerName={setBuyerName}
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