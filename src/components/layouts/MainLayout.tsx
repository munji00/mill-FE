import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logout } from "@/app/store/slices/authSlice";
import { PATHS } from "@/app/router/paths";
import { USER_ROLE } from "@/types";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  Bell,
  LogOut,
  X,
  MessageSquare,
  ShieldCheck,
  Settings,
  ChevronUp,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

interface WhatsAppAlert {
  id: string;
  message: string;
  destinations: string;
  details: string;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { language, setLanguage, t } = useLanguage();
  
  const [whatsappAlerts, setWhatsappAlerts] = useState<WhatsAppAlert[]>([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    if (!profileDropdownOpen) return;
    const closeDropdown = () => setProfileDropdownOpen(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, [profileDropdownOpen]);

  // Listen for simulated WhatsApp dispatches
  useEffect(() => {
    const handleWhatsAppEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newAlert: WhatsAppAlert = {
        id: "wa-" + Date.now(),
        message: customEvent.detail.message,
        destinations: customEvent.detail.destinations,
        details: customEvent.detail.details,
      };
      setWhatsappAlerts((prev) => [...prev, newAlert]);
      
      // Auto dismiss after 7 seconds
      setTimeout(() => {
        setWhatsappAlerts((prev) => prev.filter((a) => a.id !== newAlert.id));
      }, 7000);
    };

    window.addEventListener("mill_whatsapp_alert", handleWhatsAppEvent);
    return () => {
      window.removeEventListener("mill_whatsapp_alert", handleWhatsAppEvent);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("mill_access_token");
    navigate(PATHS.LOGIN);
  };

  if (!user) {
    return <>{children}</>;
  }

  const isMasterAdmin = user.role === USER_ROLE.MASTER_ADMIN;
  const isPartner = user.role === USER_ROLE.PARTNER;

  // Build sidebar menu items based on role
  const menuItems = isMasterAdmin
    ? [
        { path: PATHS.DASHBOARD, label: t("global_dashboard"), icon: LayoutDashboard },
        { path: PATHS.PARTY, label: t("parties_management"), icon: Users },
      ]
    : [
        { path: PATHS.DASHBOARD, label: t("party_dashboard"), icon: LayoutDashboard },
        { path: PATHS.PURCHASE, label: t("purchases"), icon: ShoppingBag },
        { path: PATHS.SALES, label: t("sales"), icon: TrendingUp },
        { path: PATHS.EXPENSES, label: t("expenses"), icon: DollarSign },
        { path: PATHS.LABOUR, label: t("labour_manage"), icon: Briefcase },
        { path: PATHS.INVENTORY, label: t("inventory"), icon: Layers },
        { path: PATHS.PARTNERS, label: t("partners"), icon: Users },
        { path: PATHS.NOTIFICATIONS, label: t("notifications"), icon: Bell },
      ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans" dir="ltr">
      {/* Sidebar - Permanently visible, light-themed */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-lg shadow-md shadow-blue-500/30">
              RM
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 text-md tracking-wider leading-none">
                {t("app_title")}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                {isMasterAdmin ? "Global Operations" : user.tenant?.name || "Single Party"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 relative">
          {/* Floating Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute bottom-[4.5rem] left-4 right-4 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate(PATHS.PROFILE);
                }}
                className="flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <Settings size={14} className="text-slate-400" />
                <span>{t("settings")}</span>
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 w-full px-4 py-2.5 hover:bg-red-50 text-red-600 text-xs font-semibold transition cursor-pointer"
              >
                <LogOut size={14} />
                <span>{t("sign_out")}</span>
              </button>
            </div>
          )}

          {/* Profile Click Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setProfileDropdownOpen(!profileDropdownOpen);
            }}
            className="flex items-center justify-between w-full p-2 hover:bg-slate-100 rounded-xl transition cursor-pointer text-left focus:outline-none"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="bg-blue-600 shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs uppercase shadow-sm">
                {user.fullName.substring(0, 2)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{user.fullName}</p>
                <p className="text-[10px] font-semibold text-slate-400 capitalize truncate mt-0.5">{user.role.toLowerCase().replace("_", " ")}</p>
              </div>
            </div>
            <ChevronUp size={16} className={`text-slate-400 transition-transform duration-200 shrink-0 ${profileDropdownOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden" dir="ltr">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="block">
              <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                {isMasterAdmin ? (
                  <>
                    <ShieldCheck className="text-blue-600" size={22} />
                    <span>{t("global_admin_header")}</span>
                  </>
                ) : (
                  <span>{(user.tenant?.name || "Single Party") + " " + t("dashboard")}</span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer text-slate-700"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ur">اردو (Urdu)</option>
            </select>

            {/* Quick badges */}
            {!isMasterAdmin && (
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  isPartner
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {isPartner ? "🔒 Partner (Read-only)" : "⚡ Admin Access"}
              </span>
            )}
            {isMasterAdmin && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-800">
                👑 Super User
              </span>
            )}

            {/* Notification Drawer Shortcut */}
            {!isMasterAdmin && (
              <Link
                to={PATHS.NOTIFICATIONS}
                className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full ring-2 ring-white"></span>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
          {children}
        </main>
      </div>

      {/* Floating Simulated WhatsApp Logs (Bottom Right Toast) */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 w-80 max-w-sm pointer-events-none">
        {whatsappAlerts.map((alert) => (
          <div
            key={alert.id}
            className="pointer-events-auto bg-emerald-600 text-white rounded-xl shadow-2xl p-4 flex flex-col space-y-2 border border-emerald-500 transition-all duration-300 transform translate-y-0 scale-100 animate-slide-up"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-white p-1 rounded-full text-emerald-600">
                  <MessageSquare size={16} />
                </div>
                <span className="text-xs font-extrabold tracking-wider uppercase">
                  WhatsApp Broadcast
                </span>
              </div>
              <button
                onClick={() => setWhatsappAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
                className="text-emerald-200 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-xs font-semibold leading-relaxed">
              {alert.message}
            </p>
            <div className="bg-emerald-700/60 rounded p-2 text-[10px] text-emerald-100 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
              Recipients: {alert.destinations}
            </div>
            <div className="text-[9px] text-emerald-200/90 text-right">
              ✓ Sent to Partners
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
