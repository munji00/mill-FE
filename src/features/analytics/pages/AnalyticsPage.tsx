import { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Activity, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Printer
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadPDF } from "@/utils/pdfHelper";
import { DatePicker } from "@/components/common/DatePicker";
import { useGetAnalyticsQuery } from "../api/analyticsApi";
import PrintBillModal from "../components/PrintBillModal";

export default function AnalyticsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { language, t } = useLanguage();

  const [selectedBillRecord, setSelectedBillRecord] = useState<any | null>(null);

  // Active query filters state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [itemName, setItemName] = useState("");
  const [page, setPage] = useState(1);
  const limit = 100;

  // Staged draft filters state
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftItemName, setDraftItemName] = useState("");

  const { data: response, isLoading, error } = useGetAnalyticsQuery({
    startDate,
    endDate,
    name,
    itemName,
    page,
    limit,
  });

  if (!user) return null;

  const records = response?.data || [];
  const pagination = response?.pagination || { totalCount: 0, totalPages: 1, currentPage: 1, limit: 100 };
  const summary = response?.summary || { totalSales: 0, totalPurchase: 0, totalExpenses: 0, netAmount: 0 };

  // Compute suggestions from data (fallbacks when response is empty/loading)
  const uniqueNamesSuggestions = Array.from(new Set(records.map((r) => r.name))).filter(Boolean);
  const uniqueItemsSuggestions = Array.from(new Set(records.map((r) => r.itemName))).filter(Boolean);

  const handleDownloadPDF = () => {
    downloadPDF("analytics-table-container", `${user?.tenant?.name || "Mill"}_Analytics_Report`, {
      title: t("analytics") || "Operations Analytics",
      subtitle: "Unified Transaction History and Net Balance Sheet",
      tenantName: user?.tenant?.name,
      tenantCode: user?.tenant?.code,
      language: language,
      orientation: "landscape",
    });
  };

  const handleApplyFilters = () => {
    setPage(1);
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
    setName(draftName);
    setItemName(draftItemName);
  };

  const handleClearFilters = () => {
    setPage(1);
    setStartDate("");
    setEndDate("");
    setName("");
    setItemName("");

    setDraftStartDate("");
    setDraftEndDate("");
    setDraftName("");
    setDraftItemName("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("analytics") || "Analytics"}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated cross-ledger statement and transaction tracking
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer text-xs sm:text-sm w-full sm:w-auto"
          >
            <Download size={16} className="shrink-0" />
            <span>{t("download_report") || "Download Report"}</span>
          </button>
        </div>
      </div>

      {/* Analytics summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {t("total_sales") || "Total Sales"}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1 font-mono">
              Rs. {summary.totalSales.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        {/* Purchase Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingBag size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {t("total_purchase") || "Total Purchase"}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1 font-mono">
              Rs. {summary.totalPurchase.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <DollarSign size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {t("total_expenses") || "Total Expenses"}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1 font-mono">
              Rs. {summary.totalExpenses.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${summary.netAmount >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            <Activity size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Net Revenue</span>
            <h3 className={`text-lg font-extrabold mt-1 font-mono ${summary.netAmount >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              Rs. {summary.netAmount.toLocaleString("en-IN")}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="space-y-4 py-2 border-b border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Date range picker */}
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

          {/* Name filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Name (Supplier/Buyer/Other)</span>
            <input
              type="text"
              list="analytics-names-list"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Search supplier, buyer, etc..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-sans font-medium"
            />
            <datalist id="analytics-names-list">
              {uniqueNamesSuggestions.map((nameSuggestion) => (
                <option key={nameSuggestion} value={nameSuggestion} />
              ))}
            </datalist>
          </div>

          {/* Item Name filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Item Name / Description</span>
            <input
              type="text"
              list="analytics-items-list"
              value={draftItemName}
              onChange={(e) => setDraftItemName(e.target.value)}
              placeholder="Search product, category..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-white font-sans font-medium"
            />
            <datalist id="analytics-items-list">
              {uniqueItemsSuggestions.map((itemSuggestion) => (
                <option key={itemSuggestion} value={itemSuggestion} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Filters control button trigger */}
        <div className="flex items-center space-x-3 pt-1">
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm hover:shadow"
          >
            Apply Filters
          </button>
          {(draftStartDate || draftEndDate || draftName || draftItemName || startDate || endDate || name || itemName) && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1 text-xs font-bold text-red-500 hover:text-red-700 transition cursor-pointer"
            >
              <X size={14} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Main transactions spreadsheet table */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Fetching consolidated analytical ledger...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 text-center">
          Failed to load ledger database.
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
          <Activity className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">No Analytics Data</h3>
          <p className="text-sm text-slate-400 mt-1">No transaction items found matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <table className="w-full text-center border-collapse min-w-[1150px]" id="analytics-table-container">
                <thead>
                  <tr className="border-b border-slate-200/60 text-slate-700 text-xs font-extrabold uppercase tracking-wider bg-slate-50/80">
                    <th className="px-6 py-4 text-center">Date</th>
                    <th className="px-6 py-4 text-center">Ledger Type</th>
                    <th className="px-6 py-4 text-center">Account / Name</th>
                    <th className="px-6 py-4 text-center">Item Name / Description</th>
                    <th className="px-6 py-4 text-center">Amount</th>
                    <th className="px-6 py-4 text-center">Details</th>
                    <th className="px-6 py-4 text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-600">
                  {records.map((rec, idx) => {
                    // Decide colored type tags
                    let typeBadgeColor = "";
                    if (rec.type === "Sale") {
                      typeBadgeColor = "text-emerald-600 font-extrabold";
                    } else if (rec.type === "Purchase") {
                      typeBadgeColor = "text-blue-600 font-extrabold";
                    } else if (rec.type === "Expense") {
                      typeBadgeColor = "text-amber-500 font-extrabold";
                    } else {
                      typeBadgeColor = "text-indigo-500 font-extrabold";
                    }

                    return (
                      <tr 
                        key={rec.id + idx}
                        className={`hover:bg-slate-100/50 transition-colors border-b border-slate-100/60 ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                        }`}
                      >
                        <td className="px-6 py-4 font-mono text-xs text-slate-500 whitespace-nowrap text-center">
                          {rec.date}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-center ${typeBadgeColor}`}>
                          {rec.type}
                        </td>
                        <td className="px-6 py-4 font-sans font-bold text-slate-800 whitespace-nowrap text-center">
                          {rec.name}
                        </td>
                        <td className="px-6 py-4 font-sans text-slate-600 whitespace-nowrap text-center">
                          {rec.itemName}
                        </td>
                        <td className={`px-6 py-4 font-mono font-bold whitespace-nowrap text-center ${
                          rec.type === "Sale" ? "text-emerald-600" : "text-slate-900"
                        }`}>
                          Rs. {rec.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 font-sans text-xs text-slate-400 whitespace-nowrap text-center max-w-[200px] truncate">
                          {rec.details}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap no-print">
                          <button
                            onClick={() => setSelectedBillRecord(rec)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Print Invoice"
                          >
                            <Printer size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-slate-500 font-medium">
                Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} records)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {pagination.currentPage}
                </span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedBillRecord && (
        <PrintBillModal
          record={selectedBillRecord}
          onClose={() => setSelectedBillRecord(null)}
          tenant={user.tenant}
        />
      )}
    </div>
  );
}
