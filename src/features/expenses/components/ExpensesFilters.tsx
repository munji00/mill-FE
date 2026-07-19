import React from "react";
import { X } from "lucide-react";
import { DatePicker } from "@/components/common/DatePicker";

interface ExpensesFiltersProps {
  draftStartDate: string;
  setDraftStartDate: (val: string) => void;
  draftEndDate: string;
  setDraftEndDate: (val: string) => void;
  draftSelectedCategory: string;
  setDraftSelectedCategory: (val: string) => void;
  draftMinAmount: string;
  setDraftMinAmount: (val: string) => void;
  draftMaxAmount: string;
  setDraftMaxAmount: (val: string) => void;
  startDate: string;
  endDate: string;
  selectedCategory: string;
  minAmount: string;
  maxAmount: string;
  uniqueCategories: string[];
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const ExpensesFilters: React.FC<ExpensesFiltersProps> = ({
  draftStartDate,
  setDraftStartDate,
  draftEndDate,
  setDraftEndDate,
  draftSelectedCategory,
  setDraftSelectedCategory,
  draftMinAmount,
  setDraftMinAmount,
  draftMaxAmount,
  setDraftMaxAmount,
  startDate,
  endDate,
  selectedCategory,
  minAmount,
  maxAmount,
  uniqueCategories,
  onApplyFilters,
  onClearFilters,
}) => {

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category</span>
          <select
            value={draftSelectedCategory}
            onChange={(e) => setDraftSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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
        <div className="flex items-end space-x-3 sm:col-span-2">
          <button
            onClick={onApplyFilters}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm hover:shadow"
          >
            Apply Filters
          </button>
          {(draftStartDate || draftEndDate || draftSelectedCategory || draftMinAmount || draftMaxAmount || startDate || endDate || selectedCategory || minAmount || maxAmount) && (
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
