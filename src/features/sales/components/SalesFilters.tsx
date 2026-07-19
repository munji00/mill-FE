import React from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DatePicker } from "@/components/common/DatePicker";

interface SalesFiltersProps {
  draftStartDate: string;
  setDraftStartDate: (val: string) => void;
  draftEndDate: string;
  setDraftEndDate: (val: string) => void;
  draftSelectedItemName: string;
  setDraftSelectedItemName: (val: string) => void;
  draftSelectedBuyerName: string;
  setDraftSelectedBuyerName: (val: string) => void;
  draftMinAmount: string;
  setDraftMinAmount: (val: string) => void;
  draftMaxAmount: string;
  setDraftMaxAmount: (val: string) => void;
  startDate: string;
  endDate: string;
  selectedItemName: string;
  selectedBuyerName: string;
  minAmount: string;
  maxAmount: string;
  uniqueItems: string[];
  uniqueBuyers: string[];
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const SalesFilters: React.FC<SalesFiltersProps> = ({
  draftStartDate,
  setDraftStartDate,
  draftEndDate,
  setDraftEndDate,
  draftSelectedItemName,
  setDraftSelectedItemName,
  draftSelectedBuyerName,
  setDraftSelectedBuyerName,
  draftMinAmount,
  setDraftMinAmount,
  draftMaxAmount,
  setDraftMaxAmount,
  startDate,
  endDate,
  selectedItemName,
  selectedBuyerName,
  minAmount,
  maxAmount,
  uniqueItems,
  uniqueBuyers,
  onApplyFilters,
  onClearFilters,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Date Range Group */}
        <div className="space-y-1.5 sm:col-span-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date Range (Start - End)</span>
          <div className="flex items-center space-x-2">
            <DatePicker
              value={draftStartDate}
              onChange={setDraftStartDate}
              placeholder="Start Date"
              className="w-full"
            />
            <span className="text-slate-400 text-xs">to</span>
            <DatePicker
              value={draftEndDate}
              onChange={setDraftEndDate}
              placeholder="End Date"
              className="w-full"
            />
          </div>
        </div>

        {/* Item Name Dropdown */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t("item_name")}</span>
          <select
            value={draftSelectedItemName}
            onChange={(e) => setDraftSelectedItemName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
          >
            <option value="">All Items</option>
            {uniqueItems.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Buyer Name Input (Manual + Suggestions Datalist) */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t("buyer_name")}</span>
          <input
            type="text"
            list="buyers-list"
            value={draftSelectedBuyerName}
            onChange={(e) => setDraftSelectedBuyerName(e.target.value)}
            placeholder="Type or select buyer..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-sans font-medium"
          />
          <datalist id="buyers-list">
            {uniqueBuyers.map((buyer) => (
              <option key={buyer} value={buyer} />
            ))}
          </datalist>
        </div>

        {/* Min/Max Amount Group */}
        <div className="space-y-1.5 sm:col-span-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Amount Range (Min - Max)</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min Amount"
              value={draftMinAmount}
              onChange={(e) => setDraftMinAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="number"
              placeholder="Max Amount"
              value={draftMaxAmount}
              onChange={(e) => setDraftMaxAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-end space-x-3 sm:col-span-3">
          <button
            onClick={onApplyFilters}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm hover:shadow"
          >
            Apply Filters
          </button>
          {(draftStartDate || draftEndDate || draftSelectedItemName || draftSelectedBuyerName || draftMinAmount || draftMaxAmount || startDate || endDate || selectedItemName || selectedBuyerName || minAmount || maxAmount) && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 text-xs font-bold text-red-500 hover:text-red-700 transition cursor-pointer pb-2"
            >
              <X size={14} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
