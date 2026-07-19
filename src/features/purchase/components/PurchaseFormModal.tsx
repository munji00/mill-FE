import React from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DatePicker } from "@/components/common/DatePicker";

interface PurchaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord: any;
  onSave: (e: React.FormEvent) => void;
  itemName: string;
  setItemName: (val: string) => void;
  quantity: number;
  setQuantity: (val: number) => void;
  unit: string;
  setUnit: (val: string) => void;
  pricePerUnit: number;
  setPricePerUnit: (val: number) => void;
  supplierName: string;
  setSupplierName: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  paymentStatus: string;
  setPaymentStatus: (val: string) => void;
  isSaving?: boolean;
}

export const PurchaseFormModal: React.FC<PurchaseFormModalProps> = ({
  isOpen,
  onClose,
  editingRecord,
  onSave,
  itemName,
  setItemName,
  quantity,
  setQuantity,
  unit,
  setUnit,
  pricePerUnit,
  setPricePerUnit,
  supplierName,
  setSupplierName,
  date,
  setDate,
  paymentStatus,
  setPaymentStatus,
  isSaving = false,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <h3 className="font-extrabold text-sm">
            {editingRecord ? "Update Purchase Log" : "Log New Intake Transaction"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("item_name")}</label>
            <select
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
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
              <DatePicker
                value={date}
                onChange={setDate}
                placeholder="Select Date"
                className="w-full"
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

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </select>
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
              {isSaving ? "Saving..." : editingRecord ? "Save Changes" : "Create Intake Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
