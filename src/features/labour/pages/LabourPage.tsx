import React, { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import {
  useGetLabourQuery,
  useCreateLabourMutation,
  useUpdateLabourMutation,
  useDeleteLabourMutation,
} from "../api/labourApi";
import { Plus, UserCheck, ShieldAlert, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadPDF } from "@/utils/pdfHelper";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { LabourFilters } from "../components/LabourFilters";
import { LabourTable } from "../components/LabourTable";
import { LabourFormModal } from "../components/LabourFormModal";

export default function LabourPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading, error } = useGetLabourQuery();
  const { t, language } = useLanguage();
  const [createLabour, { isLoading: isCreating }] = useCreateLabourMutation();
  const [updateLabour, { isLoading: isUpdating }] = useUpdateLabourMutation();
  const [deleteLabour, { isLoading: isDeleting }] = useDeleteLabourMutation();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // Active filter states
  const [searchName, setSearchName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [minDailyWage, setMinDailyWage] = useState("");
  const [maxDailyWage, setMaxDailyWage] = useState("");
  const [searchContact, setSearchContact] = useState("");

  // Draft filter states
  const [draftSearchName, setDraftSearchName] = useState("");
  const [draftSelectedRole, setDraftSelectedRole] = useState("");
  const [draftMinDailyWage, setDraftMinDailyWage] = useState("");
  const [draftMaxDailyWage, setDraftMaxDailyWage] = useState("");
  const [draftSearchContact, setDraftSearchContact] = useState("");

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

  // Compute unique names for datalist
  const uniqueNames = Array.from(new Set(records.map((r: any) => r.name))).filter(Boolean);

  const filteredRecords = records.filter((r: any) => {
    // 1. Name Filter
    if (searchName && !r.name.toLowerCase().includes(searchName.toLowerCase())) return false;

    // 2. Role Filter
    if (selectedRole && r.role !== selectedRole) return false;

    // 3. Wage Filter
    const wage = r.dailyWage || 0;
    if (minDailyWage && wage < parseFloat(minDailyWage)) return false;
    if (maxDailyWage && wage > parseFloat(maxDailyWage)) return false;

    // 4. Contact Filter
    if (searchContact && !r.contact.toLowerCase().includes(searchContact.toLowerCase())) return false;

    return true;
  });

  const handleDownloadPDF = () => {
    downloadPDF("labour-table-container", `${user?.tenant?.name || "Mill"}_Labour_Report`, {
      title: t("labour_manage"),
      subtitle: t("labour_desc"),
      tenantName: user?.tenant?.name,
      tenantCode: user?.tenant?.code,
      language: language,
    });
  };

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

  const handleDelete = (id: string) => {
    if (isPartner) return;
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteLabour(deleteTargetId).unwrap();
    } catch (err) {
      console.error("Failed to delete labour:", err);
    } finally {
      setDeleteTargetId(null);
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
          <h1 className="text-2xl font-bold text-slate-900">{t("labour_manage")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("labour_desc")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:space-x-3 sm:w-auto items-center">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer text-xs sm:text-sm w-full sm:w-auto"
          >
            <Download size={16} className="shrink-0" />
            <span className="truncate">{t("download_report")}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            disabled={isPartner}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold transition cursor-pointer disabled:cursor-not-allowed text-xs sm:text-sm w-full sm:w-auto"
          >
            <Plus size={16} className="shrink-0" />
            <span className="truncate">{t("add_labour")}</span>
          </button>
        </div>
      </div>

      {/* Table Filters */}
      <LabourFilters
        draftSearchName={draftSearchName}
        setDraftSearchName={setDraftSearchName}
        draftSelectedRole={draftSelectedRole}
        setDraftSelectedRole={setDraftSelectedRole}
        draftMinDailyWage={draftMinDailyWage}
        setDraftMinDailyWage={setDraftMinDailyWage}
        draftMaxDailyWage={draftMaxDailyWage}
        setDraftMaxDailyWage={setDraftMaxDailyWage}
        draftSearchContact={draftSearchContact}
        setDraftSearchContact={setDraftSearchContact}
        searchName={searchName}
        selectedRole={selectedRole}
        minDailyWage={minDailyWage}
        maxDailyWage={maxDailyWage}
        searchContact={searchContact}
        uniqueNames={uniqueNames}
        onApplyFilters={() => {
          setSearchName(draftSearchName);
          setSelectedRole(draftSelectedRole);
          setMinDailyWage(draftMinDailyWage);
          setMaxDailyWage(draftMaxDailyWage);
          setSearchContact(draftSearchContact);
        }}
        onClearFilters={() => {
          setSearchName("");
          setSelectedRole("");
          setMinDailyWage("");
          setMaxDailyWage("");
          setSearchContact("");

          setDraftSearchName("");
          setDraftSelectedRole("");
          setDraftMinDailyWage("");
          setDraftMaxDailyWage("");
          setDraftSearchContact("");
        }}
      />

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
          <h3 className="text-lg font-bold text-slate-800">No Labour Records</h3>
          <p className="text-sm text-slate-400 mt-1">No transaction items found matching your filters.</p>
        </div>
      ) : (
        <LabourTable
          filteredRecords={filteredRecords}
          isPartner={isPartner}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* CRUD Form Dialog Modal */}
      <LabourFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingRecord={editingRecord}
        onSave={handleSave}
        name={name}
        setName={setName}
        role={role}
        setRole={setRole}
        dailyWage={dailyWage}
        setDailyWage={setDailyWage}
        presentDays={presentDays}
        setPresentDays={setPresentDays}
        unpaidDues={unpaidDues}
        setUnpaidDues={setUnpaidDues}
        contact={contact}
        setContact={setContact}
        isSaving={isCreating || isUpdating}
      />

      {/* Custom Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title={t("confirm_delete_title")}
        message={t("confirm_delete_msg")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        isConfirming={isDeleting}
      />
    </div>
  );
}