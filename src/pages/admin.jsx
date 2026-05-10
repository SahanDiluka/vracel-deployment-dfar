// src/pages/admin.jsx
import React, { useState, useEffect } from "react";
import { LoginScreen, AdminUsersSection } from "./Admin/AdminAuth";
import AdminQuickAccess from "./Admin/AdminQuickAccess";
import AdminDivisions from "./Admin/AdminDivisions";
import AdminNews from "./Admin/AdminNews";
import AdminDistrict from "./Admin/AdminDistrict";
import AdminInfromation from "./Admin/AdminInformation";
import DownloadAdminPanel from "./Admin/DownloadAdminPanel";
import OfficerAdminPanel from "./Admin/OfficerAdminPanel";
import TenderAdminPanel from "./Admin/TenderAdminPanel";
import AdminMinistry from "./Admin/AdminMinistry";
import AdminFooter from "./Admin/AdminFooter";
import PeopleAdminPanel from "./Admin/PeopleAdminPanel";
import AdminRegulations from "./Admin/AdminRegulations";
import ByCatchAdminPanel from "./Admin/AdminByCatch";

const NAV = [
  { id: "quick", label: "Quick Access", section: "Content" },
  { id: "divisions", label: "Divisions", section: "Content" },
  { id: "news", label: "News", section: "Content" },
  { id: "district", label: "District", section: "Content" },
  { id: "information", label: "Information", section: "Content" },
  { id: "ministry", label: "Ministry", section: "Content" },
  { id: "footer", label: "Footer", section: "Content" },
  { id: "downloads", label: "Downloads", section: "Content" },
  { id: "officers", label: "Officers", section: "Content" },
  { id: "tenders", label: "Tenders", section: "Content" },
  { id: "contactUs", label: "contactUs", section: "Content" },
  { id: "regulations", label: "Regulations", section: "Content" },
  { id: "bycatch", label: "By-Catch", section: "Content" },
  { id: "users", label: "Users", section: "Admin", superadmin: true },
];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("quick");

  useEffect(() => {
    const token = localStorage.getItem("dfar_token");
    if (token) {
      setUser({
        token,
        username: localStorage.getItem("dfar_username"),
        fullName: localStorage.getItem("dfar_fullname"),
        isSuperadmin: localStorage.getItem("dfar_superadmin") === "true",
      });
    }
  }, []);

  const handleLogout = () => {
    ["dfar_token", "dfar_username", "dfar_fullname", "dfar_superadmin"].forEach(
      (k) => localStorage.removeItem(k),
    );
    setUser(null);
  };

  if (!user) return <LoginScreen onLogin={setUser} />;

  const visibleNav = NAV.filter((n) => !n.superadmin || user.isSuperadmin);
  const sections = [...new Set(visibleNav.map((n) => n.section))];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f172a" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: "#1e293b",
          borderRight: "1px solid #334155",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "20px 16px 14px",
            borderBottom: "1px solid #334155",
          }}
        >
          <div style={{ fontWeight: 600, color: "#f1f5f9", fontSize: 14 }}>
            DFAR Admin
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#94a3b8",
              marginTop: 4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.fullName || user.username}
          </div>
          {user.isSuperadmin && (
            <span
              style={{
                fontSize: 10,
                background: "#1d4ed8",
                color: "#bfdbfe",
                borderRadius: 4,
                padding: "2px 6px",
                marginTop: 4,
                display: "inline-block",
              }}
            >
              Superadmin
            </span>
          )}
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {sections.map((section) => (
            <div key={section}>
              <div
                style={{
                  fontSize: 10,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "10px 16px 4px",
                }}
              >
                {section}
              </div>
              {visibleNav
                .filter((n) => n.section === section)
                .map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setPage(n.id)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 16px",
                      fontSize: 13,
                      cursor: "pointer",
                      background: page === n.id ? "#0f172a" : "none",
                      color: page === n.id ? "#f1f5f9" : "#94a3b8",
                      border: "none",
                      borderLeft:
                        page === n.id
                          ? "2px solid #3b82f6"
                          : "2px solid transparent",
                    }}
                  >
                    {n.label}
                  </button>
                ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid #334155" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              fontSize: 12,
              color: "#f87171",
              background: "none",
              border: "1px solid #7f1d1d",
              borderRadius: 6,
              padding: "5px 0",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: "auto", background: "#0f172a" }}>
        <div
          style={{
            padding: "12px 24px",
            borderBottom: "1px solid #1e293b",
            background: "#0f172a",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, color: "#f1f5f9" }}>
            {NAV.find((n) => n.id === page)?.label}
          </span>
        </div>

        <div style={{ padding: 24 }}>
          {page === "quick" && <AdminQuickAccess />}
          {page === "divisions" && <AdminDivisions />}
          {page === "news" && <AdminNews />}
          {page === "district" && <AdminDistrict />}
          {page === "information" && <AdminInfromation />}
          {page === "ministry" && <AdminMinistry />}
          {page === "footer" && <AdminFooter />}
          {page === "downloads" && <DownloadAdminPanel />}
          {page === "officers" && <OfficerAdminPanel />}
          {page === "tenders" && <TenderAdminPanel />}
          {page === "contactUs" && <PeopleAdminPanel />}
          {page === "bycatch" && <ByCatchAdminPanel />}
          {page === "regulations" && <AdminRegulations />}
          {page === "users" && user.isSuperadmin && (
            <AdminUsersSection token={user.token} />
          )}
        </div>
      </main>
    </div>
  );
}
