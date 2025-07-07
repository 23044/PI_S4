
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, Users, GraduationCap, FileCheck,
  Clock, AlertTriangle, CheckCircle2
} from "lucide-react";

export function DashboardOverview() {
  const stats = [
    { 
      title: "Thèses", 
      value: "143", 
      icon: <FileText className="h-5 w-5 text-blue-500" /> 
    },
    { 
      title: "Doctorants", 
      value: "156", 
      icon: <Users className="h-5 w-5 text-indigo-500" /> 
    },
    { 
      title: "HDR", 
      value: "28", 
      icon: <GraduationCap className="h-5 w-5 text-purple-500" /> 
    },
    { 
      title: "Soutenances à venir", 
      value: "12", 
      icon: <Clock className="h-5 w-5 text-amber-500" /> 
    },
  ];

  const validations = [
    { 
      title: "En attente de validation", 
      count: 7, 
      total: 143,
      percentage: 4.9,
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" /> 
    },
    { 
      title: "Validées", 
      count: 118, 
      total: 143,
      percentage: 82.5,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> 
    },
    { 
      title: "Soutenances validées", 
      count: 96, 
      total: 143,
      percentage: 67.1,
      icon: <FileCheck className="h-5 w-5 text-blue-500" /> 
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tableau de bord</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <h3 className="text-lg font-semibold mt-6 mb-4">État des validations</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {validations.map((validation, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {validation.title}
              </CardTitle>
              {validation.icon}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 text-sm">
                  {validation.count} sur {validation.total} thèses
                </span>
                <span className="text-sm font-medium">
                  {validation.percentage}%
                </span>
              </div>
              <Progress value={validation.percentage} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
