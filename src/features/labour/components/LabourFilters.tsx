import React from "react";
import { X } from "lucide-react";

interface LabourFiltersProps {
  draftSearchName: string;
  setDraftSearchName: (val: string) => void;
  draftSelectedRole: string;
  setDraftSelectedRole: (val: string) => void;
  draftMinDailyWage: string;
  setDraftMinDailyWage: (val: string) => void;
  draftMaxDailyWage: string;
  setDraftMaxDailyWage: (val: string) => void;
  draftSearchContact: string;
  setDraftSearchContact: (val: string) => void;
  searchName: string;
  selectedRole: string;
  minDailyWage: string;
  maxDailyWage: string;
  searchContact: string;
  uniqueNames: string[];
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const LabourFilters: React.FC<LabourFiltersProps> = ({
  draftSearchName,
  setDraftSearchName,
  draftSelectedRole,
  setDraftSelectedRole,
  draftMinDailyWage,
  setDraftMinDailyWage,
  draftMaxDailyWage,
  setDraftMaxDailyWage,
  draftSearchContact,
  setDraftSearchContact,
  searchName,
  selectedRole,
  minDailyWage,
  maxDailyWage,
  searchContact,
  uniqueNames,
  onApplyFilters,
  onClearFilters,
}) => {

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Name Input (Manual + Suggestions Datalist) */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Labour Name</span>
          <input
            type="text"
            list="labours-list"
            value={draftSearchName}
            onChange={(e) => setDraftSearchName(e.target.value)}
            placeholder="Type or select name..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-sans font-medium"
          />
          <datalist id="labours-list">
            {uniqueNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        {/* Role Dropdown */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Role</span>
          <select
            value={draftSelectedRole}
            onChange={(e) => setDraftSelectedRole(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="Machine Operator">Machine Operator</option>
            <option value="Loader / Helper">Loader / Helper</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Clerk">Clerk</option>
            <option value="Security Guard">Security Guard</option>
          </select>
        </div>

        {/* Wage Range Group */}
        <div className="space-y-1.5 sm:col-span-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Daily Wage (Min - Max)</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min Wage"
              value={draftMinDailyWage}
              onChange={(e) => setDraftMinDailyWage(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="number"
              placeholder="Max Wage"
              value={draftMaxDailyWage}
              onChange={(e) => setDraftMaxDailyWage(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Contact Input */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Contact Number</span>
          <input
            type="text"
            placeholder="Search Contact..."
            value={draftSearchContact}
            onChange={(e) => setDraftSearchContact(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white"
          />
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-end space-x-3 sm:col-span-3">
          <button
            onClick={onApplyFilters}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm hover:shadow"
          >
            Apply Filters
          </button>
          {(draftSearchName || draftSelectedRole || draftMinDailyWage || draftMaxDailyWage || draftSearchContact || searchName || selectedRole || minDailyWage || maxDailyWage || searchContact) && (
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
