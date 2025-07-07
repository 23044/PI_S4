
import { cn } from "@/lib/utils";
import { 
  FileText, Users, GraduationCap, School, ChartBar, 
  Settings, Bell, LogOut, Home
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarLink({ icon, label, active, onClick }: SidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 w-full rounded-md text-left",
        active 
          ? "bg-primary text-white" 
          : "hover:bg-slate-100 text-slate-600"
      )}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </button>
  );
}

export function Sidebar() {
  const [activeTab, setActiveTab] = useState("aperçu");
  const navigate = useNavigate();
  
  const tabs = [
    { id: "aperçu", label: "Aperçu", icon: <Home size={20} /> },
    { id: "theses", label: "Thèses", icon: <FileText size={20} /> },
    { id: "doctorants", label: "Doctorants", icon: <Users size={20} /> },
    { id: "hdr", label: "HDR", icon: <GraduationCap size={20} /> },
    { id: "unites", label: "Unités de recherche", icon: <School size={20} /> },
    { id: "rapports", label: "Rapports", icon: <ChartBar size={20} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
    { id: "parametres", label: "Paramètres", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-primary">SE-Archive Admin</h2>
      </div>
      
      <div className="flex-grow p-2 space-y-1 overflow-y-auto">
        {tabs.map((tab) => (
          <SidebarLink
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-200">
        <SidebarLink 
          icon={<LogOut size={20} />} 
          label="Déconnexion"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
