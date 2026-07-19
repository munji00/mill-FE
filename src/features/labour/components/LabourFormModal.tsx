import React from "react";
import { X } from "lucide-react";

interface LabourFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord: any;
  onSave: (e: React.FormEvent) => void;
  name: string;
  setName: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  dailyWage: number;
  setDailyWage: (val: number) => void;
  presentDays: number;
  setPresentDays: (val: number) => void;
  unpaidDues: number;
  setUnpaidDues: (val: number) => void;
  contact: string;
  setContact: (val: string) => void;
  isSaving?: boolean;
}

export const LabourFormModal: React.FC<LabourFormModalProps> = ({
  isOpen,
  onClose,
  editingRecord,
  onSave,
  name,
  setName,
  role,
  setRole,
  dailyWage,
  setDailyWage,
  presentDays,
  setPresentDays,
  unpaidDues,
  setUnpaidDues,
  contact,
  setContact,
  isSaving = false,
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <h3 className="font-extrabold text-sm">
            {editingRecord ? "Update Labour Record" : "Add New Labour Profile"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Role / Job Title</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none bg-white cursor-pointer"
            >
              <option value="Loader / Helper">Loader / Helper</option>
              <option value="Machine Operator">Machine Operator</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Clerk">Clerk</option>
              <option value="Security Guard">Security Guard</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Daily Wage (Rs.)</label>
              <input
                type="number"
                required
                min={1}
                value={dailyWage}
                onChange={(e) => setDailyWage(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Present Days</label>
              <input
                type="number"
                required
                min={0}
                value={presentDays}
                onChange={(e) => setPresentDays(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Unpaid Dues (Rs.)</label>
              <input
                type="number"
                required
                min={0}
                value={unpaidDues}
                onChange={(e) => setUnpaidDues(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Contact Number</label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border flex justify-between items-center text-xs">
            <span className="font-bold text-slate-500 uppercase">Estimated Monthly Earns:</span>
            <span className="font-mono font-extrabold text-sm text-slate-900">
              Rs. {(dailyWage * presentDays).toLocaleString("en-IN")}
            </span>
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
              {isSaving ? "Saving..." : editingRecord ? "Save Changes" : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
