import React, { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import { useGetPartnersQuery, useCreatePartnerMutation } from "../api/partnersApi";
import { Plus, X, Search, ShieldAlert, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PartnersPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error, refetch } = useGetPartnersQuery();
  const { t } = useLanguage();
  const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  if (!user) return null;
  const isPartner = user.role === USER_ROLE.PARTNER;

  const records = response?.data || [];
  const filteredRecords = records.filter(
    (r) =>
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    if (isPartner) return;
    setFullName("");
    setEmail("");
    setPassword("");
    setMobileNumber("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPartner || !fullName || !email || !password || !mobileNumber) return;

    const payload = {
      fullName,
      email,
      password,
      mobileNumber,
    };

    try {
      await createPartner(payload).unwrap();
      refetch(); // Reload the list of partners
      setShowModal(false);
    } catch (err) {
      console.error("Failed to register partner:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Read Only Warn Banner */}
      {isPartner && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-center space-x-3 text-xs font-semibold">
          <ShieldAlert className="text-amber-600 shrink-0" size={18} />
          <span>Read-only Partner Session: Registering new partners or managing user permissions is reserved for the Mill Admin.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("partners")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("partners_desc")}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          disabled={isPartner}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold transition cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          <span>{t("register_new_partner")}</span>
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
            placeholder={t("search_placeholder")}
            className="w-full pl-10 rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Fetching partners...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 text-center">
          Failed to load partners list.
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
          <User className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No Partners Registered</h3>
          <p className="text-sm text-slate-400 mt-1">No partner entries found matching your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">{t("full_name")}</th>
                  <th className="px-6 py-4">{t("email_address")}</th>
                  <th className="px-6 py-4">{t("mobile_whatsapp")}</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <User size={14} className="text-slate-400" />
                        <span>{rec.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-slate-400" />
                        <span>{rec.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className="text-slate-400" />
                        <span>{rec.mobileNumber || "Not Configured"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 size={10} className="mr-1" />
                        {t("active")}
                      </span>
                    </td>
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
                Register New Partner
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("full_name")}</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Amit Kumar"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("email_address")}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. amit@mill.com"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("mobile_whatsapp")}</label>
                <input
                  type="text"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("password")}</label>
                <input
                  type="password"
                  required
                  min={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password must be at least 6 characters"
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition shadow-md shadow-blue-500/20"
                >
                  {isCreating ? "Registering..." : t("register_partner")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
