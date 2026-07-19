import React, { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import {
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} from "../api/purchaseApi";
import { Plus, ShoppingBag, ShieldAlert, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadPDF } from "@/utils/pdfHelper";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PurchaseFilters } from "../components/PurchaseFilters";
import { PurchaseTable } from "../components/PurchaseTable";
import { PurchaseFormModal } from "../components/PurchaseFormModal";

export default function PurchasePage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetPurchasesQuery();
  const { t, language } = useLanguage();
  const [createPurchase, { isLoading: isCreating }] = useCreatePurchaseMutation();
  const [updatePurchase, { isLoading: isUpdating }] = useUpdatePurchaseMutation();
  const [deletePurchase, { isLoading: isDeleting }] = useDeletePurchaseMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // Search & Filter Active States (applied on search click)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedSupplierName, setSelectedSupplierName] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  // Search & Filter Draft States (bound to user inputs)
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");
  const [draftSelectedItemName, setDraftSelectedItemName] = useState("");
  const [draftSelectedSupplierName, setDraftSelectedSupplierName] = useState("");
  const [draftMinAmount, setDraftMinAmount] = useState("");
  const [draftMaxAmount, setDraftMaxAmount] = useState("");
  const [draftSelectedPaymentStatus, setDraftSelectedPaymentStatus] = useState("");

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
  const [paymentStatus, setPaymentStatus] = useState("Paid");

  if (!user) return null;
  const isPartner = user.role === USER_ROLE.PARTNER;

  const records = response?.data || [];

  // Compute unique items and suppliers for selects
  const uniqueItems = Array.from(new Set(records.map((r: any) => r.itemName))).filter(Boolean);
  const uniqueSuppliers = Array.from(new Set(records.map((r: any) => r.supplierName))).filter(Boolean);

  const filteredRecords = records.filter((r: any) => {
    // 1. Date Range Filter
    if (startDate && r.date < startDate) return false;
    if (endDate && r.date > endDate) return false;

    // 2. Item Name Filter
    if (selectedItemName && r.itemName !== selectedItemName) return false;

    // 3. Supplier Name Filter
    if (selectedSupplierName && r.supplierName !== selectedSupplierName) return false;

    // 4. Amount Filter
    const amount = r.totalAmount || 0;
    if (minAmount && amount < parseFloat(minAmount)) return false;
    if (maxAmount && amount > parseFloat(maxAmount)) return false;

    // 5. Payment Status Filter
    const status = r.paymentStatus || "Paid";
    if (selectedPaymentStatus && status !== selectedPaymentStatus) return false;

    return true;
  });

  const handleOpenAdd = () => {
    if (isPartner) return;
    setEditingRecord(null);
    setItemName("Paddy Raw Basmati (1121)");
    setQuantity(100);
    setUnit("Bags");
    setPricePerUnit(2200);
    setSupplierName("");
    setDate(new Date().toISOString().split("T")[0]);
    setPaymentStatus("Paid");
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
    setPaymentStatus(rec.paymentStatus || "Paid");
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
      paymentStatus,
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

  const handleDelete = (id: string) => {
    if (isPartner) return;
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deletePurchase(deleteTargetId).unwrap();
    } catch (err) {
      console.error("Failed to delete purchase:", err);
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
            <span className="truncate">{t("add_purchase")}</span>
          </button>
        </div>
      </div>

      {/* Table Filters Grid */}
      <PurchaseFilters
        draftStartDate={draftStartDate}
        setDraftStartDate={setDraftStartDate}
        draftEndDate={draftEndDate}
        setDraftEndDate={setDraftEndDate}
        draftSelectedItemName={draftSelectedItemName}
        setDraftSelectedItemName={setDraftSelectedItemName}
        draftSelectedSupplierName={draftSelectedSupplierName}
        setDraftSelectedSupplierName={setDraftSelectedSupplierName}
        draftMinAmount={draftMinAmount}
        setDraftMinAmount={setDraftMinAmount}
        draftMaxAmount={draftMaxAmount}
        setDraftMaxAmount={setDraftMaxAmount}
        draftSelectedPaymentStatus={draftSelectedPaymentStatus}
        setDraftSelectedPaymentStatus={setDraftSelectedPaymentStatus}
        startDate={startDate}
        endDate={endDate}
        selectedItemName={selectedItemName}
        selectedSupplierName={selectedSupplierName}
        minAmount={minAmount}
        maxAmount={maxAmount}
        selectedPaymentStatus={selectedPaymentStatus}
        uniqueItems={uniqueItems}
        uniqueSuppliers={uniqueSuppliers}
        onApplyFilters={() => {
          setStartDate(draftStartDate);
          setEndDate(draftEndDate);
          setSelectedItemName(draftSelectedItemName);
          setSelectedSupplierName(draftSelectedSupplierName);
          setMinAmount(draftMinAmount);
          setMaxAmount(draftMaxAmount);
          setSelectedPaymentStatus(draftSelectedPaymentStatus);
        }}
        onClearFilters={() => {
          setStartDate("");
          setEndDate("");
          setSelectedItemName("");
          setSelectedSupplierName("");
          setMinAmount("");
          setMaxAmount("");
          setSelectedPaymentStatus("");

          setDraftStartDate("");
          setDraftEndDate("");
          setDraftSelectedItemName("");
          setDraftSelectedSupplierName("");
          setDraftMinAmount("");
          setDraftMaxAmount("");
          setDraftSelectedPaymentStatus("");
        }}
      />

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
        <PurchaseTable
          filteredRecords={filteredRecords}
          isPartner={isPartner}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* CRUD Form Dialog Modal */}
      <PurchaseFormModal
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
        supplierName={supplierName}
        setSupplierName={setSupplierName}
        date={date}
        setDate={setDate}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
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