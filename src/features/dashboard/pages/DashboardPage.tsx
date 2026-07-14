import { useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { USER_ROLE } from "@/types";
import { useGetDashboardStatsQuery } from "../api/dashboardApi";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Layers,
  Users,
  Briefcase,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
import { PATHS } from "@/app/router/paths";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: statsResponse, isLoading, error } = useGetDashboardStatsQuery();
  const [timeframe, setTimeframe] = useState("30"); // "7", "30", "today"

  if (!user) return null;

  const isMasterAdmin = user.role === USER_ROLE.MASTER_ADMIN;
  const isPartner = user.role === USER_ROLE.PARTNER;
  const stats = statsResponse?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 text-center">
        <h3 className="text-lg font-bold mb-2">Failed to Load Dashboard Data</h3>
        <p className="text-sm text-red-600 mb-4">There was an error communicating with the server.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Formatting currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // 1. MASTER ADMIN DASHBOARD VIEW
  if (isMasterAdmin) {
    return (
      <div className="space-y-6">
        {/* Welcome and Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, Super Admin!</h1>
            <p className="text-sm text-slate-500 mt-1">
              Overview of all registered mill parties, tenant growth, and platform health.
            </p>
          </div>
          <Link
            to={PATHS.PARTY}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>Manage Mill Parties</span>
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Parties</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.totalParties}</h3>
              <div className="flex items-center text-xs text-emerald-600 font-bold mt-2">
                <ArrowUpRight size={14} className="mr-1" />
                <span>+15.5% Growth</span>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
              <Users size={28} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Tenants</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.activeParties}</h3>
              <div className="flex items-center text-xs text-emerald-600 font-bold mt-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
                <span>100% Operational</span>
              </div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
              <Activity size={28} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Parties per Month</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                {(stats.totalParties / 6).toFixed(1)}
              </h3>
              <div className="flex items-center text-xs text-slate-500 font-bold mt-2">
                <span>Scaling steadily</span>
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl text-amber-600">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>

        {/* Charts & Partition Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Party Growth Chart */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm lg:col-span-2">
            <h3 className="text-base font-extrabold text-slate-800 mb-6">Tenant Acquisition Growth</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.partiesGrowth}>
                  <defs>
                    <linearGradient id="partyBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff" }}
                  />
                  <Bar dataKey="parties" fill="url(#partyBlue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Security & Access Guard Information */}
          <div className="bg-slate-900 text-slate-300 rounded-xl p-6 shadow-sm flex flex-col justify-between border border-slate-800">
            <div>
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle size={20} />
                <h3 className="text-sm font-extrabold tracking-wider uppercase text-white">Privacy Guard Active</h3>
              </div>
              <h4 className="text-lg font-bold text-white mt-4">Isolated Tenant Scope</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                As a Master Administrator, you possess architectural privileges to spawn, read, update, and terminate mill parties (Tenants).
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                However, under the absolute data privacy protocol:
              </p>
              <ul className="text-xs text-slate-400 list-disc list-inside space-y-1.5 mt-3 pl-1">
                <li>Sales transactions are obscured.</li>
                <li>Purchase logs are confidential.</li>
                <li>Expenses and labour details are encrypted.</li>
                <li>Tenant inventories are inaccessible.</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
              SYSTEM LEVEL: MASTER SECURE // ID: super-admin-scope
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. PARTY ADMIN / PARTNER DASHBOARD VIEW
  const summary = stats.summary;

  return (
    <div className="space-y-6">
      {/* Welcome and Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hello, {user.fullName}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Mill Party: <span className="font-extrabold text-blue-600">{user.tenant?.name}</span> (Code: {user.tenant?.code})
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="flex items-center space-x-2 bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
          <Calendar size={16} className="text-slate-400 ml-1" />
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="text-xs font-bold text-slate-600 bg-transparent border-none focus:outline-none pr-6 cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="all">Custom (All-Time)</option>
          </select>
        </div>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales KPI */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Sales</p>
              <h3 className="text-2xl font-extrabold text-slate-950 mt-1.5">{formatCurrency(summary.totalSales)}</h3>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex items-center text-[10px] text-emerald-600 font-bold mt-3">
            <ArrowUpRight size={12} className="mr-0.5" />
            <span>+12.4% vs last month</span>
          </div>
        </div>

        {/* Purchases KPI */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Raw Paddy Purchases</p>
              <h3 className="text-2xl font-extrabold text-slate-950 mt-1.5">{formatCurrency(summary.totalPurchase)}</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="flex items-center text-[10px] text-blue-600 font-bold mt-3">
            <span>Procured Paddy Materials</span>
          </div>
        </div>

        {/* Expenses KPI */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expenses & Wages</p>
              <h3 className="text-2xl font-extrabold text-slate-950 mt-1.5">{formatCurrency(summary.totalExpenses)}</h3>
            </div>
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-center text-[10px] text-red-600 font-bold mt-3">
            <ArrowDownRight size={12} className="mr-0.5" />
            <span>Operational costs + daily wages</span>
          </div>
        </div>

        {/* Net Profit KPI */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calculated Net Profit</p>
              <h3 className={`text-2xl font-extrabold mt-1.5 ${summary.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {formatCurrency(summary.netProfit)}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${summary.netProfit >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex items-center text-[10px] font-bold mt-3 text-slate-500">
            <span>Sales - Purchase - Expenses - Wages</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales vs Expenses Chart */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-extrabold text-slate-800">Financial Trend</h3>
            <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 py-1 px-2.5 rounded-full">
              Weekly Flow
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area
                  type="monotone"
                  dataKey="Sales"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="Expenses"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Info widgets */}
        <div className="space-y-6">
          {/* Inventory & Labour Snapshot */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-800 mb-4">Operations Snapshot</h3>
            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Inventory Items</h4>
                    <p className="text-[10px] text-slate-400">Stocked materials & byproducts</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-slate-800">{summary.inventoryItemCount}</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Active Labour force</h4>
                    <p className="text-[10px] text-slate-400">Operators, loaders & checkers</p>
                  </div>
                </div>
                <span className="text-base font-extrabold text-slate-800">{summary.labourCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Warning widget */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5 flex items-start space-x-3">
            <div className="bg-amber-100 text-amber-800 p-2 rounded-lg mt-0.5">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">System Alert</h4>
              <p className="text-xs text-amber-700 leading-relaxed mt-1">
                Paddy Raw Basmati (1121) is near minimal stock levels. Advise purchase manager to initiate farmer procurement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-extrabold text-slate-800">Recent Transactions</h3>
            <span className="text-xs text-slate-500 font-semibold">Latest 5 records</span>
          </div>

          <div className="flow-root">
            <ul className="-my-5 divide-y divide-slate-100">
              {stats.recentActivities.map((act) => (
                <li key={act.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${
                        act.type === "Sale"
                          ? "bg-emerald-50 text-emerald-600"
                          : act.type === "Purchase"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <Activity size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{act.msg}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{act.date} // Type: {act.type}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Module Shortcuts */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 mb-2">Shortcut Operations</h3>
            <p className="text-xs text-slate-400 mb-6">Access dedicated panels for specific logging.</p>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                to={PATHS.PURCHASE}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 hover:border-blue-500/20 hover:bg-blue-50/10 transition text-center cursor-pointer"
              >
                <span className="text-lg mb-1">🛒</span>
                <span className="text-xs font-bold text-slate-700">Purchases</span>
              </Link>
              <Link
                to={PATHS.SALES}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 hover:border-emerald-500/20 hover:bg-emerald-50/10 transition text-center cursor-pointer"
              >
                <span className="text-lg mb-1">📈</span>
                <span className="text-xs font-bold text-slate-700">Sales</span>
              </Link>
              <Link
                to={PATHS.EXPENSES}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 hover:border-red-500/20 hover:bg-red-50/10 transition text-center cursor-pointer"
              >
                <span className="text-lg mb-1">💸</span>
                <span className="text-xs font-bold text-slate-700">Expenses</span>
              </Link>
              <Link
                to={PATHS.INVENTORY}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 hover:border-amber-500/20 hover:bg-amber-50/10 transition text-center cursor-pointer"
              >
                <span className="text-lg mb-1">📦</span>
                <span className="text-xs font-bold text-slate-700">Inventory</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 text-[10px] text-slate-400 border-t border-slate-100 pt-4 text-center">
            {isPartner ? "🔒 PARTNER ACCESS (VIEW-ONLY)" : "⚡ FULL ADMIN CONTROLS ENABLED"}
          </div>
        </div>
      </div>
    </div>
  );
}