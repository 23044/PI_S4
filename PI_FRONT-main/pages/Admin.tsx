
import { useState } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { Header } from "../dashboard/Header";
import { DashboardOverview } from "../dashboard/DashboardOverview";
import { ThesesTable } from "../dashboard/ThesesTable";
import { DoctorantsTable } from "../dashboard/DoctorantsTable";
import { UsersTable } from "../dashboard/UsersTable";
import { UnitsTable } from "../dashboard/UnitsTable";
import { Reports } from "../dashboard/Reports";
import { NotificationsPanel } from "../dashboard/NotificationsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("apercu");

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="mb-6">
              <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              <TabsTrigger value="theses">Thèses</TabsTrigger>
              <TabsTrigger value="doctorants">Doctorants</TabsTrigger>
              <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
              <TabsTrigger value="unites">Unités & Écoles</TabsTrigger>
              <TabsTrigger value="rapports">Rapports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            {/* Aperçu */}
            <TabsContent value="apercu" className="space-y-6">
              <DashboardOverview />
            </TabsContent>
            
            {/* Gestion des thèses */}
            <TabsContent value="theses">
              <ThesesTable />
            </TabsContent>
            
            {/* Gestion des doctorants */}
            <TabsContent value="doctorants">
              <DoctorantsTable />
            </TabsContent>

            {/* Gestion des utilisateurs */}
            <TabsContent value="utilisateurs">
              <UsersTable />
            </TabsContent>

            {/* Gestion des unités et écoles doctorales */}
            <TabsContent value="unites">
              <UnitsTable />
            </TabsContent>

            {/* Rapports et statistiques */}
            <TabsContent value="rapports">
              <Reports />
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <NotificationsPanel />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
