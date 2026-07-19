import React from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DatePicker } from "@/components/common/DatePicker";

interface ExpensesFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord: any;
  onSave: (e: React.FormEvent) => void;
  category: string;
  setCategory: (val: string) => void;
  amount: number;
  setAmount: (val: number) => void;
  description: string;
  setDescription: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  isSaving?: boolean;
}

export const ExpensesFormModal: React.FC<ExpensesFormModalProps> = ({
  isOpen,
  onClose,
  editingRecord,
  onSave,
  category,
  setCategory,
  amount,
  setAmount,
  description,
  setDescription,
  date,
  setDate,
  isSaving = false,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <h3 className="font-extrabold text-sm">
            {editingRecord ? "Update Expense Log" : "Log New Expense"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
            >
              <option value="Electricity Bill">Electricity Bill</option>
              <option value="Water Charges">Water Charges</option>
              <option value="Machinery Maintenance">Machinery Maintenance</option>
              <option value="Office Stationery">Office Stationery</option>
              <option value="Other Operational Costs">Other Operational Costs</option>
            </select>
          </div>

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
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the expense..."
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-sans min-h-[80px] resize-none"
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
              {isSaving ? "Saving..." : editingRecord ? "Save Changes" : "Create Expense Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
