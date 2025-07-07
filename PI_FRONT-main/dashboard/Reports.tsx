
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, Download, PieChart as PieChartIcon, BarChart as BarChartIcon } from "lucide-react";
import { toast } from "sonner";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function Reports() {
  const [reportType, setReportType] = useState("theses");
  const [year, setYear] = useState("2023");
  const [chartType, setChartType] = useState("bar");
  
  // Données pour les graphiques
  const thesesByStatusData = [
    { name: 'En cours', value: 42 },
    { name: 'Soumises', value: 18 },
    { name: 'Validées', value: 65 },
    { name: 'Rejetées', value: 7 },
    { name: 'Soutenues', value: 11 },
  ];
  
  const thesesBySchoolData = [
    { name: 'Sciences & Tech.', value: 45 },
    { name: 'Sciences Vie', value: 38 },
    { name: 'Sciences Humaines', value: 60 },
  ];
  
  const thesesByMonthData = [
    { name: 'Jan', theses: 4, soutenances: 1 },
    { name: 'Fév', theses: 7, soutenances: 3 },
    { name: 'Mar', theses: 5, soutenances: 0 },
    { name: 'Avr', theses: 10, soutenances: 2 },
    { name: 'Mai', theses: 8, soutenances: 4 },
    { name: 'Jun', theses: 12, soutenances: 5 },
    { name: 'Jul', theses: 6, soutenances: 8 },
    { name: 'Aoû', theses: 3, soutenances: 1 },
    { name: 'Sep', theses: 15, soutenances: 3 },
    { name: 'Oct', theses: 9, soutenances: 6 },
    { name: 'Nov', theses: 11, soutenances: 4 },
    { name: 'Déc', theses: 6, soutenances: 2 },
  ];
  
  // Fonction pour générer un rapport Excel/PDF (simulation)
  const generateReport = (type: string) => {
    toast.success(`Rapport ${type} généré avec succès. Le téléchargement va commencer.`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Select 
            value={reportType} 
            onValueChange={setReportType}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Type de rapport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="theses">Thèses</SelectItem>
              <SelectItem value="doctorants">Doctorants</SelectItem>
              <SelectItem value="soutenances">Soutenances</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={year} 
            onValueChange={setYear}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md">
            <Button 
              variant={chartType === "bar" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setChartType("bar")}
              className="rounded-r-none"
            >
              <BarChartIcon className="h-4 w-4 mr-2" />
              Barres
            </Button>
            <Button 
              variant={chartType === "pie" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setChartType("pie")}
              className="rounded-l-none"
            >
              <PieChartIcon className="h-4 w-4 mr-2" />
              Secteurs
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => generateReport('Excel')} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button onClick={() => generateReport('PDF')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="status">
        <TabsList className="mb-4">
          <TabsTrigger value="status">Par statut</TabsTrigger>
          <TabsTrigger value="school">Par école doctorale</TabsTrigger>
          <TabsTrigger value="monthly">Évolution mensuelle</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des thèses par statut ({year})</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                {chartType === "bar" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      width={500} 
                      height={300} 
                      data={thesesByStatusData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Nombre de thèses" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                      <Pie
                        data={thesesByStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {thesesByStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des thèses par école doctorale ({year})</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                {chartType === "bar" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      width={500} 
                      height={300} 
                      data={thesesBySchoolData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#00C49F" name="Nombre de thèses" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                      <Pie
                        data={thesesBySchoolData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {thesesBySchoolData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Évolution mensuelle des thèses et soutenances ({year})</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={thesesByMonthData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="theses" name="Thèses déposées" fill="#8884d8" />
                    <Bar dataKey="soutenances" name="Soutenances" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
