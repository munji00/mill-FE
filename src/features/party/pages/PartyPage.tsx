import { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import {
  useGetPartiesQuery,
  useCreatePartyMutation,
  useUpdatePartyMutation,
  useDeletePartyMutation,
} from "../api/partyApi";
import { ShieldAlert, Plus, Edit2, Trash2, X, Factory, Mail, Phone, MapPin, User as UserIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PartyPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: partiesResponse, isLoading, error } = useGetPartiesQuery(undefined, {
    skip: user?.role !== USER_ROLE.MASTER_ADMIN,
  });
  const { t } = useLanguage();

  const [createParty, { isLoading: isCreating }] = useCreatePartyMutation();
  const [updateParty, { isLoading: isUpdating }] = useUpdatePartyMutation();
  const [deleteParty] = useDeletePartyMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingParty, setEditingParty] = useState<any>(null);
  
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerMobile, setOwnerMobile] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [townOrVillage, setTownOrVillage] = useState("");
  const [subscriptionMonths, setSubscriptionMonths] = useState<number>(3);

  if (!user) return null;

  // Authorization Guard: Only Master Admin can manage parties
  if (user.role !== USER_ROLE.MASTER_ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-xl mx-auto text-center px-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-full mb-4">
          <ShieldAlert size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Restricted Access Scope</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Your account role is registered as <span className="font-extrabold text-blue-600">{user.role}</span>. 
          Only the Master Administrator has privileges to view, create, edit, or terminate mill parties.
        </p>
      </div>
    );
  }

  const parties = partiesResponse?.data || [];

  const handleOpenAdd = () => {
    setEditingParty(null);
    setName("");
    setCode("");
    setEmail("");
    setContactNumber("");
    setRegisterNumber("");
    setOwnerName("");
    setOwnerMobile("");
    setStateName("");
    setCity("");
    setTownOrVillage("");
    setSubscriptionMonths(3);
    setShowModal(true);
  };

  const handleOpenEdit = (party: any) => {
    setEditingParty(party);
    setName(party.name);
    setCode(party.code);
    setEmail(party.email || "");
    setContactNumber(party.contactNumber || "");
    setRegisterNumber(party.registerNumber || "");
    setOwnerName(party.ownerName || "");
    setOwnerMobile(party.ownerMobile || "");
    setStateName(party.state || "");
    setCity(party.city || "");
    setTownOrVillage(party.townOrVillage || "");
    setSubscriptionMonths(party.subscription?.type === "FREE_TRIAL" ? 3 : 3);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    try {
      if (editingParty) {
        await updateParty({
          id: editingParty.id,
          data: {
            name,
            code,
            email,
            contactNumber,
            registerNumber,
            ownerName,
            ownerMobile,
            state: stateName,
            city,
            townOrVillage,
          },
        }).unwrap();
      } else {
        await createParty({
          name,
          code,
          email,
          contactNumber,
          registerNumber,
          ownerName,
          ownerMobile,
          state: stateName,
          city,
          townOrVillage,
          subscriptionMonths,
        }).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save party:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this Mill Party? This action is irreversible.")) {
      try {
        await deleteParty(id).unwrap();
      } catch (err) {
        console.error("Failed to delete party:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("parties")}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("parties_desc")}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold transition cursor-pointer"
        >
          <Plus size={18} />
          <span>Provision New Party</span>
        </button>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Fetching parties registry...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 text-center">
          Failed to load parties registry.
        </div>
      ) : parties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
          <Factory className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No Parties Provisioned</h3>
          <p className="text-sm text-slate-400 mt-1">Get started by provisioning your first mill tenant channel.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Party/Mill Name</th>
                  <th className="px-6 py-4">Owner Info</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Registry / Contact</th>
                  <th className="px-6 py-4">Subscription Plan</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {parties.map((party) => (
                  <tr key={party.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center space-x-3">
                      <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg shrink-0">
                        <Factory size={18} />
                      </div>
                      <div>
                        <span className="block font-bold">{party.name}</span>
                        <span className="block font-mono text-[10px] text-slate-400 mt-0.5 uppercase">CODE: {party.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {party.ownerName ? (
                        <div>
                          <span className="block font-semibold text-slate-800 flex items-center space-x-1">
                            <UserIcon size={12} className="text-slate-400 mr-1" />
                            {party.ownerName}
                          </span>
                          <span className="block text-[11px] text-slate-500 font-mono mt-0.5">{party.ownerMobile || "-"}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No Owner Info</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {party.state || party.city || party.townOrVillage ? (
                        <div className="flex items-start space-x-1.5">
                          <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="block">{party.townOrVillage || "-"}</span>
                            <span className="block text-slate-400">{[party.city, party.state].filter(Boolean).join(", ")}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No Location</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="space-y-1">
                        {party.email && (
                          <span className="flex items-center text-slate-600 font-medium">
                            <Mail size={12} className="text-slate-400 mr-1.5" />
                            {party.email}
                          </span>
                        )}
                        {party.contactNumber && (
                          <span className="flex items-center text-slate-600 font-medium">
                            <Phone size={12} className="text-slate-400 mr-1.5" />
                            {party.contactNumber}
                          </span>
                        )}
                        {party.registerNumber && (
                          <span className="inline-block bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            REG: {party.registerNumber}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {party.subscription ? (
                        <div>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded font-bold text-xs ${
                              party.subscription.isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}
                          >
                            {party.subscription.isActive ? "ACTIVE" : "EXPIRED"}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                            Type: {party.subscription.type}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            Expires: {party.subscription.nextSubscription ? new Date(party.subscription.nextSubscription).toLocaleDateString() : "-"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No Subscription</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(party)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Edit Party"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(party.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Party"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provisioning/Editing Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <h3 className="font-extrabold text-base">
                {editingParty ? "Update Mill Profile" : "Provision New Mill Channel"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Grid 1: Basic Information */}
              <div>
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                  Basic Info & Registry
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("mill_name")}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Haryana Rice Agro"
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("tenant_code")}</label>
                    <input
                      type="text"
                      required
                      disabled={!!editingParty}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. HRA-12"
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono uppercase disabled:bg-slate-50 disabled:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("register_number")}</label>
                    <input
                      type="text"
                      value={registerNumber}
                      onChange={(e) => setRegisterNumber(e.target.value)}
                      placeholder="e.g. REG-789-A"
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 2: Owner & Contact details */}
              <div>
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                  Owner & Contacts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("owner_name")}</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Owner name"
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("owner_mobile")}</label>
                    <input
                      type="text"
                      value={ownerMobile}
                      onChange={(e) => setOwnerMobile(e.target.value)}
                      placeholder="Owner Mobile No."
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("email_address")}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="info@mill.com"
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("contact_number")}</label>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Landline / Alternate Contact"
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 3: Location */}
              <div>
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                  Location details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("state")}</label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="e.g. Haryana"
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("city")}</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Karnal"
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">{t("town_village")}</label>
                    <input
                      type="text"
                      value={townOrVillage}
                      onChange={(e) => setTownOrVillage(e.target.value)}
                      placeholder="e.g. Taraori"
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 4: Subscription */}
              {!editingParty && (
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
                    Subscription Billing (Free Trial)
                  </h4>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                      Select Trial Duration
                    </label>
                    <select
                      value={subscriptionMonths}
                      onChange={(e) => setSubscriptionMonths(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-xs bg-white focus:border-blue-500 focus:outline-none font-bold text-slate-700"
                    >
                      <option value={3}>3 Months Free Trial</option>
                      <option value={6}>6 Months Free Trial</option>
                      <option value={12}>1 Year Free Trial</option>
                    </select>
                  </div>
                </div>
              )}

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
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition shadow-md shadow-blue-500/20"
                >
                  {isCreating || isUpdating ? "Saving..." : editingParty ? t("save_changes") : t("save_changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}