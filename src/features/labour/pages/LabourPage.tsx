import React, { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import {
  useGetLabourQuery,
  useCreateLabourMutation,
  useUpdateLabourMutation,
  useDeleteLabourMutation,
} from "../api/labourApi";
import { Plus, Edit2, Trash2, X, Search, UserCheck, Briefcase, Phone, ShieldAlert } from "lucide-react";

export default function LabourPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetLabourQuery();
  const [createLabour, { isLoading: isCreating }] = useCreateLabourMutation();
  const [updateLabour, { isLoading: isUpdating }] = useUpdateLabourMutation();
  const [deleteLabour] = useDeleteLabourMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("Machine Operator");
  const [dailyWage, setDailyWage] = useState<number>(0);
  const [presentDays, setPresentDays] = useState<number>(0);
  const [unpaidDues, setUnpaidDues] = useState<number>(0);
  const [contact, setContact] = useState("");

  if (!user) return null;
  const isPartner = user.role === USER_ROLE.PARTNER;

  const records = response?.data || [];
  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    if (isPartner) return;
    setEditingRecord(null);
    setName("");
    setRole("Loader / Helper");
    setDailyWage(450);
    setPresentDays(20);
    setUnpaidDues(0);
    setContact("");
    setShowModal(true);
  };

  const handleOpenEdit = (rec: any) => {
    if (isPartner) return;
    setEditingRecord(rec);
    setName(rec.name);
    setRole(rec.role);
    setDailyWage(rec.dailyWage);
    setPresentDays(rec.presentDays);
    setUnpaidDues(rec.unpaidDues);
    setContact(rec.contact);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPartner || !name || !role || dailyWage <= 0 || presentDays < 0 || unpaidDues < 0 || !contact) return;

    const payload = {
      name,
      role,
      dailyWage,
      presentDays,
      unpaidDues,
      contact,
    };

    try {
      if (editingRecord) {
        await updateLabour({ id: editingRecord.id, data: payload }).unwrap();
      } else {
        await createLabour(payload).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save labour record:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (isPartner) return;
    if (confirm("Are you sure you want to delete this labour profile?")) {
      try {
        await deleteLabour(id).unwrap();
      } catch (err) {
        console.error("Failed to delete labour:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Read Only Warn Banner */}
      {isPartner && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-center space-x-3 text-xs font-semibold">
          <ShieldAlert className="text-amber-600 shrink-0" size={18} />
          <span>Read-only Partner Session: Managing labour profiles, daily attendance or wage configurations is reserved for the Mill Admin.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Labour Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Register daily wage workers, verify active operators, track present days, and manage dues payouts.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          disabled={isPartner}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold transition cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          <span>Register New Worker</span>
        </button>
      </div>

      {/* Table Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search worker name or designation..."
            className="w-full pl-10 rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Interactive Table List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Fetching labour roster...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 text-center">
          Failed to load labour registry.
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
          <UserCheck className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No Registered Workers</h3>
          <p className="text-sm text-slate-400 mt-1">No profiles found matching your search term.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Worker Name</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Daily Wage</th>
                  <th className="px-6 py-4">Present Days</th>
                  <th className="px-6 py-4">Total Wages</th>
                  <th className="px-6 py-4">Unpaid Dues</th>
                  {!isPartner && <th className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{rec.name}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center space-x-2">
                      <Briefcase size={14} className="text-slate-400" />
                      <span>{rec.role}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono flex items-center space-x-2">
                      <Phone size={14} className="text-slate-400" />
                      <span>{rec.contact}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">
                      Rs. {rec.dailyWage}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800 text-center">
                      {rec.presentDays}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      Rs. {(rec.dailyWage * rec.presentDays).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          rec.unpaidDues > 0
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                      >
                        Rs. {rec.unpaidDues}
                      </span>
                    </td>
                    {!isPartner && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(rec)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Form Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-extrabold text-sm">
                {editingRecord ? "Edit Worker Profile" : "Register Worker Profile"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Worker Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jaspreet Singh"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Designation</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Machine Operator">Machine Operator</option>
                    <option value="Loader / Helper">Loader / Helper</option>
                    <option value="Quality Checker">Quality Checker</option>
                    <option value="Generator Tech">Generator Tech</option>
                    <option value="Boiler Supervisor">Boiler Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Contact Number</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. +91 99999 88888"
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Daily Wage (Rs.)</label>
                  <input
                    type="number"
                    required
                    min={100}
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
                    max={31}
                    value={presentDays}
                    onChange={(e) => setPresentDays(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Pending Dues</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={unpaidDues}
                    onChange={(e) => setUnpaidDues(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase font-sans">Total Accumulate Wages:</span>
                <span className="font-mono font-extrabold text-sm text-slate-900">
                  Rs. {(dailyWage * presentDays).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition shadow-md shadow-blue-500/20"
                >
                  {isCreating || isUpdating ? "Saving..." : editingRecord ? "Update Profile" : "Register Worker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}