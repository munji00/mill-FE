import React from "react";
import { X } from "lucide-react";

interface InventoryFiltersProps {
  draftSearchItemName: string;
  setDraftSearchItemName: (val: string) => void;
  draftSelectedCategory: string;
  setDraftSelectedCategory: (val: string) => void;
  draftMinStockQuantity: string;
  setDraftMinStockQuantity: (val: string) => void;
  draftMaxStockQuantity: string;
  setDraftMaxStockQuantity: (val: string) => void;
  draftShowLowStockOnly: boolean;
  setDraftShowLowStockOnly: (val: boolean) => void;
  searchItemName: string;
  selectedCategory: string;
  minStockQuantity: string;
  maxStockQuantity: string;
  showLowStockOnly: boolean;
  uniqueItems: string[];
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  draftSearchItemName,
  setDraftSearchItemName,
  draftSelectedCategory,
  setDraftSelectedCategory,
  draftMinStockQuantity,
  setDraftMinStockQuantity,
  draftMaxStockQuantity,
  setDraftMaxStockQuantity,
  draftShowLowStockOnly,
  setDraftShowLowStockOnly,
  searchItemName,
  selectedCategory,
  minStockQuantity,
  maxStockQuantity,
  showLowStockOnly,
  uniqueItems,
  onApplyFilters,
  onClearFilters,
}) => {

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Item Name Input (Manual + Suggestions Datalist) */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Item Name</span>
          <input
            type="text"
            list="inventory-items-list"
            value={draftSearchItemName}
            onChange={(e) => setDraftSearchItemName(e.target.value)}
            placeholder="Type or select item..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-sans font-medium"
          />
          <datalist id="inventory-items-list">
            {uniqueItems.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
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
            <option value="Raw Material">Raw Material</option>
            <option value="Finished Goods">Finished Goods</option>
            <option value="Packaging">Packaging</option>
            <option value="Byproduct">Byproduct</option>
          </select>
        </div>

        {/* Stock Quantity Range Group */}
        <div className="space-y-1.5 sm:col-span-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Stock Quantity (Min - Max)</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min Stock"
              value={draftMinStockQuantity}
              onChange={(e) => setDraftMinStockQuantity(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="number"
              placeholder="Max Stock"
              value={draftMaxStockQuantity}
              onChange={(e) => setDraftMaxStockQuantity(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Low Stock Toggle */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Low Stock Alert</span>
          <select
            value={draftShowLowStockOnly ? "low" : "all"}
            onChange={(e) => setDraftShowLowStockOnly(e.target.value === "low")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
          >
            <option value="all">All Items</option>
            <option value="low">Low Stock Warning</option>
          </select>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-end space-x-3 sm:col-span-3">
          <button
            onClick={onApplyFilters}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm hover:shadow"
          >
            Apply Filters
          </button>
          {(draftSearchItemName || draftSelectedCategory || draftMinStockQuantity || draftMaxStockQuantity || draftShowLowStockOnly || searchItemName || selectedCategory || minStockQuantity || maxStockQuantity || showLowStockOnly) && (
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
