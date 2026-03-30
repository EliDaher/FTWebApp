import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./BrandLogo";
import {
  FaBars,
  FaChartLine,
  FaBoxes,
  FaChevronDown,
  FaChevronLeft,
  FaDumbbell,
  FaHome,
  FaList,
  FaMoneyBill,
  FaRunning,
  FaSignOutAlt,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
};

function MenuLink({ to, label, icon, onNavigate }: NavItem & { onNavigate: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
          isActive
            ? "border border-yellow-300/45 bg-yellow-400/20 text-yellow-100"
            : "text-yellow-50/90 hover:bg-yellow-400/10 hover:text-yellow-100"
        }`
      }
    >
      <span className="text-base opacity-90">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    main: false,
    training: false,
    accounting: false,
  });
  const { userType, logout } = useAuth();
  const navigate = useNavigate();

  const commonItems = useMemo<NavItem[]>(
    () => [
      { to: "/Home", label: "الرئيسية", icon: <FaHome /> },
      { to: "/UserWorkout", label: "تمرين اليوم", icon: <FaRunning /> },
      { to: "/MyBilling", label: "فواتيري", icon: <FaMoneyBill /> },
    ],
    []
  );

  const adminTrainingItems = useMemo<NavItem[]>(
    () => [
      { to: "/UsersPage", label: "المستخدمون", icon: <FaUsers /> },
      { to: "/Exercises", label: "التمارين", icon: <FaDumbbell /> },
      { to: "/WorkOuts", label: "البرامج التدريبية", icon: <FaList /> },
      { to: "/NutritionList", label: "البرامج الغذائية", icon: <FaList /> },
    ],
    []
  );

  const adminAccountingItems = useMemo<NavItem[]>(
    () => [
      { to: "/Plans", label: "\u062e\u0637\u0637 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643", icon: <FaMoneyBill /> },
      { to: "/Accounting", label: "\u0627\u0644\u0645\u062d\u0627\u0633\u0628\u0629", icon: <FaMoneyBill /> },
      { to: "/Balance", label: "\u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629", icon: <FaChartLine /> },
      { to: "/Inventory", label: "\u0627\u0644\u0645\u062e\u0632\u0648\u0646", icon: <FaBoxes /> },
    ],
    []
  );
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSection = (section: keyof typeof collapsedSections) =>
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/login");
  };

  return (
    <>
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className={`fixed right-4 top-4 z-[65] h-11 w-11 rounded-full border text-white shadow-lg backdrop-blur ${
          sidebarOpen
            ? "border-yellow-200/70 bg-yellow-400 text-black"
            : "border-yellow-300/30 bg-black/80 text-yellow-100 hover:bg-zinc-900/90"
        }`}
        aria-label="تبديل قائمة التنقل"
      >
        {sidebarOpen ? <FaTimes className="mx-auto text-lg" /> : <FaBars className="mx-auto text-lg" />}
      </button>

      <aside
        className={`fixed right-0 top-0 z-[60] h-full w-[86%] max-w-sm border-l border-yellow-300/20 bg-black/95 px-4 pb-6 pt-5 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 rounded-2xl border border-yellow-300/25 bg-yellow-400/10 p-4">
          <BrandLogo imageClassName="h-11 w-11" />
          <h1 className="mt-2 text-right font-Orbitron text-xl font-black text-yellow-200">لوحة التحكم</h1>
          <p className="mt-1 text-right text-sm text-yellow-100/75">{userType === "admin" ? "صلاحية مدير" : "صلاحية مستخدم"}</p>
        </div>

        <nav className="space-y-5" dir="rtl">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => toggleSection("main")}
              className="flex w-full items-center justify-between px-1 text-xs uppercase tracking-[0.13em] text-yellow-100/65"
            >
              <span>القائمة الرئيسية</span>
              {collapsedSections.main ? <FaChevronLeft className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
            </button>
            {!collapsedSections.main
              ? commonItems.map((item) => <MenuLink key={item.to} {...item} onNavigate={closeSidebar} />)
              : null}
          </div>

          {userType === "admin" ? (
            <>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleSection("training")}
                  className="flex w-full items-center justify-between px-1 text-xs uppercase tracking-[0.13em] text-yellow-100/65"
                >
                  <span>التدريب</span>
                  {collapsedSections.training ? (
                    <FaChevronLeft className="text-[10px]" />
                  ) : (
                    <FaChevronDown className="text-[10px]" />
                  )}
                </button>
                {!collapsedSections.training
                  ? adminTrainingItems.map((item) => <MenuLink key={item.to} {...item} onNavigate={closeSidebar} />)
                  : null}
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleSection("accounting")}
                  className="flex w-full items-center justify-between px-1 text-xs uppercase tracking-[0.13em] text-yellow-100/65"
                >
                  <span>المحاسبة</span>
                  {collapsedSections.accounting ? (
                    <FaChevronLeft className="text-[10px]" />
                  ) : (
                    <FaChevronDown className="text-[10px]" />
                  )}
                </button>
                {!collapsedSections.accounting
                  ? adminAccountingItems.map((item) => <MenuLink key={item.to} {...item} onNavigate={closeSidebar} />)
                  : null}
              </div>
            </>
          ) : null}
        </nav>

        <div className="mt-8 border-t border-yellow-300/15 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-300/45 bg-yellow-400/15 px-3 py-2.5 font-semibold text-yellow-100 hover:bg-yellow-400/22"
          >
            <FaSignOutAlt />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" onClick={closeSidebar} aria-hidden="true" />
      ) : null}
    </>
  );
}


