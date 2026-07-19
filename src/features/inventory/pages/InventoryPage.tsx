import React, { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import {
  useGetInventoryQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} from "../api/inventoryApi";
import { Plus, Layers, ShieldAlert, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadPDF } from "@/utils/pdfHelper";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { InventoryFilters } from "../components/InventoryFilters";
import { InventoryTable } from "../components/InventoryTable";
import { InventoryFormModal } from "../components/InventoryFormModal";

export default function InventoryPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetInventoryQuery();
  const { t, language } = useLanguage();
  const [createInventory, { isLoading: isCreating }] = useCreateInventoryMutation();
  const [updateInventory, { isLoading: isUpdating }] = useUpdateInventoryMutation();
  const [deleteInventory, { isLoading: isDeleting }] = useDeleteInventoryMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // Active filter states
  const [searchItemName, setSearchItemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minStockQuantity, setMinStockQuantity] = useState("");
  const [maxStockQuantity, setMaxStockQuantity] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Draft filter states
  const [draftSearchItemName, setDraftSearchItemName] = useState("");
  const [draftSelectedCategory, setDraftSelectedCategory] = useState("");
  const [draftMinStockQuantity, setDraftMinStockQuantity] = useState("");
  const [draftMaxStockQuantity, setDraftMaxStockQuantity] = useState("");
  const [draftShowLowStockOnly, setDraftShowLowStockOnly] = useState(false);

  // Form Fields
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<"Raw Material" | "Finished Goods" | "Packaging" | "Byproduct">("Raw Material");
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [unit, setUnit] = useState("Bags");
  const [minStockAlert, setMinStockAlert] = useState<number>(0);

  if (!user) return null;
  const isPartner = user.role === USER_ROLE.PARTNER;

  const records = response?.data || [];

  // Compute unique items for datalist suggestion
  const uniqueItems = Array.from(new Set(records.map((r: any) => r.itemName))).filter(Boolean);

  const filteredRecords = records.filter((r: any) => {
    // 1. Item Name Filter
    if (searchItemName && !r.itemName.toLowerCase().includes(searchItemName.toLowerCase())) return false;

    // 2. Category Filter
    if (selectedCategory && r.category !== selectedCategory) return false;

    // 3. Stock Level Filter
    const stock = r.stockQuantity || 0;
    if (minStockQuantity && stock < parseFloat(minStockQuantity)) return false;
    if (maxStockQuantity && stock > parseFloat(maxStockQuantity)) return false;

    // 4. Low Stock Alert
    if (showLowStockOnly) {
      const isLow = r.stockQuantity <= r.minStockAlert;
      if (!isLow) return false;
    }

    return true;
  });

  const handleDownloadPDF = () => {
    downloadPDF("inventory-table-container", `${user?.tenant?.name || "Mill"}_Inventory_Report`, {
      title: t("inventory"),
      subtitle: t("inventory_desc"),
      tenantName: user?.tenant?.name,
      tenantCode: user?.tenant?.code,
      language: language,
    });
  };

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
      <InventoryFilters
        draftSearchItemName={draftSearchItemName}
        setDraftSearchItemName={setDraftSearchItemName}
        draftSelectedCategory={draftSelectedCategory}
        setDraftSelectedCategory={setDraftSelectedCategory}
        draftMinStockQuantity={draftMinStockQuantity}
        setDraftMinStockQuantity={setDraftMinStockQuantity}
        draftMaxStockQuantity={draftMaxStockQuantity}
        setDraftMaxStockQuantity={setDraftMaxStockQuantity}
        draftShowLowStockOnly={draftShowLowStockOnly}
        setDraftShowLowStockOnly={setDraftShowLowStockOnly}
        searchItemName={searchItemName}
        selectedCategory={selectedCategory}
        minStockQuantity={minStockQuantity}
        maxStockQuantity={maxStockQuantity}
        showLowStockOnly={showLowStockOnly}
        uniqueItems={uniqueItems}
        onApplyFilters={() => {
          setSearchItemName(draftSearchItemName);
          setSelectedCategory(draftSelectedCategory);
          setMinStockQuantity(draftMinStockQuantity);
          setMaxStockQuantity(draftMaxStockQuantity);
          setShowLowStockOnly(draftShowLowStockOnly);
        }}
        onClearFilters={() => {
          setSearchItemName("");
          setSelectedCategory("");
          setMinStockQuantity("");
          setMaxStockQuantity("");
          setShowLowStockOnly(false);

          setDraftSearchItemName("");
          setDraftSelectedCategory("");
          setDraftMinStockQuantity("");
          setDraftMaxStockQuantity("");
          setDraftShowLowStockOnly(false);
        }}
      />

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
        <InventoryTable
          filteredRecords={filteredRecords}
          isPartner={isPartner}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* CRUD Form Dialog Modal */}
      <InventoryFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingRecord={editingRecord}
        onSave={handleSave}
        itemName={itemName}
        setItemName={setItemName}
        category={category}
        setCategory={setCategory}
        stockQuantity={stockQuantity}
        setStockQuantity={setStockQuantity}
        unit={unit}
        setUnit={setUnit}
        minStockAlert={minStockAlert}
        setMinStockAlert={setMinStockAlert}
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