import React from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InventoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord: any;
  onSave: (e: React.FormEvent) => void;
  itemName: string;
  setItemName: (val: string) => void;
  category: "Raw Material" | "Finished Goods" | "Packaging" | "Byproduct";
  setCategory: (val: "Raw Material" | "Finished Goods" | "Packaging" | "Byproduct") => void;
  stockQuantity: number;
  setStockQuantity: (val: number) => void;
  unit: string;
  setUnit: (val: string) => void;
  minStockAlert: number;
  setMinStockAlert: (val: number) => void;
  isSaving?: boolean;
}

export const InventoryFormModal: React.FC<InventoryFormModalProps> = ({
  isOpen,
  onClose,
  editingRecord,
  onSave,
  itemName,
  setItemName,
  category,
  setCategory,
  stockQuantity,
  setStockQuantity,
  unit,
  setUnit,
  minStockAlert,
  setMinStockAlert,
  isSaving = false,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <h3 className="font-extrabold text-sm">
            {editingRecord ? "Update Inventory Record" : "Add New Stock Category"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("item_name")}</label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Basmati Paddy Grade A"
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Category Type</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
            >
              <option value="Raw Material">Raw Material</option>
              <option value="Finished Goods">Finished Goods</option>
              <option value="Packaging">Packaging</option>
              <option value="Byproduct">Byproduct</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Stock Quantity</label>
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
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("unit")}</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
              >
                <option value="Bags">Bags</option>
                <option value="Tons">Tons</option>
                <option value="Quintals">Quintals</option>
                <option value="Pieces">Pieces</option>
                <option value="Liters">Liters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Minimum Stock Alarm Threshold</label>
            <input
              type="number"
              required
              min={0}
              value={minStockAlert}
              onChange={(e) => setMinStockAlert(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              {isSaving ? "Saving..." : editingRecord ? "Save Changes" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
