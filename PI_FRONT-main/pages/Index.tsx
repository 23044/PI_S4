
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Système d'Archivage des Thèses et HDR</h1>
        <p className="text-xl text-gray-600 mb-8">
          Bienvenue sur la plateforme d'archivage et de gestion des thèses de doctorat et des habilitations à diriger des recherches.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/admin")} size="lg" className="px-8">
            Accéder à l'administration
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            Espace doctorant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
