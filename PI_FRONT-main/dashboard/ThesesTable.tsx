
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Eye, Check, X, Filter, Download, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ValidationModal } from "./ValidationModal";
import { toast } from "sonner";

type These = {
  id: string;
  titre: string;
  doctorant: string;
  directeur: string;
  encadrant : string;
  dateDepot: string;
  dateSoutenance: string | null;
  ecoleDoctorale: string;
  status: "en_cours" | "soumis" | "validé" | "rejeté" | "soutenu" | "en_attente" | "publié";
  uniteRecherche: string;
  fichierPdf?: string;

};

export function ThesesTable() {
  const [selectedThese, setSelectedThese] = useState<These | null>(null);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("tous");
  const [theses, setTheses] = useState<These[]>([
    {
      id: "1",
      titre: "Optimisation des performances des algorithmes d'apprentissage automatique",
      doctorant: "Jean Dupont",
      directeur: "Pr. Marie Lambert",
      dateDepot: "12/03/2023",
      dateSoutenance: "15/12/2023",
      status: "en_cours",
      uniteRecherche: "Laboratoire d'Informatique",
      fichierPdf: "these_dupont.pdf",
      encadrant: "Dr. Alice Martin",
      ecoleDoctorale: "École Doctorale Informatique"
    },
    {
      id: "2",
      titre: "Impact des changements climatiques sur la biodiversité marine",
      doctorant: "Sophie Martin",
      directeur: "Dr. Pierre Dubois",
      dateDepot: "05/01/2023",
      dateSoutenance: null,
      status: "soumis",
      uniteRecherche: "Institut d'Océanographie",
      fichierPdf: "these_martin.pdf",
      encadrant: "Dr. Claire Bernard" , 
      ecoleDoctorale: "École Doctorale Environnement" 
    },
    {
      id: "3",
      titre: "Mécanismes moléculaires de la résistance aux antibiotiques",
      doctorant: "Thomas Bernard",
      directeur: "Pr. Jeanne Moreau",
      dateDepot: "22/09/2022",
      dateSoutenance: "30/03/2023",
      status: "validé",
      uniteRecherche: "Laboratoire de Microbiologie",
      fichierPdf: "these_bernard.pdf",
      encadrant: "Dr. Lucie Lefevre" ,
      ecoleDoctorale: "École Doctorale Biologie"
    },
    {
      id: "4",
      titre: "Développement durable et transformation des entreprises",
      doctorant: "Lucie Petit",
      directeur: "Dr. Marc Durand",
      dateDepot: "18/11/2022",
      dateSoutenance: null,
      status: "rejeté",
      uniteRecherche: "Centre d'Études Économiques",
      fichierPdf: "these_petit.pdf" ,
      encadrant: "Dr. sidatt Lefevre" ,
      ecoleDoctorale: "École Doctorale Économie"
    },
    {
      id: "5",
      titre: "Modélisation mathématique des épidémies virales",
      doctorant: "Éric Leroy",
      directeur: "Pr. Sylvie Lefevre",
      dateDepot: "03/02/2022",
      dateSoutenance: "12/09/2022",
      status: "soutenu",
      uniteRecherche: "Institut de Mathématiques Appliquées",
      fichierPdf: "these_leroy.pdf",
      encadrant: "Dr. Alain Dupuis" , 
      ecoleDoctorale: "École Doctorale Mathématiques"
    },
    {
      id: "6",
      titre: "Intelligence artificielle et éthique des algorithmes",
      doctorant: "Nathalie Roux",
      directeur: "Dr. François Lemaire",
      dateDepot: "14/04/2023",
      dateSoutenance: null,
      status: "en_attente",
      uniteRecherche: "Laboratoire d'Informatique et d'IA",
      fichierPdf: "these_roux.pdf",
      encadrant: "Dr. Camille Bernard" ,
      ecoleDoctorale: "École Doctorale Informatique"
    },
    {
      id: "7",
      titre: "Avancées en génie biomédical et applications cliniques",
      doctorant: "Philippe Moreau",
      directeur: "Dr. Christine Dubois",
      dateDepot: "08/05/2022",
      dateSoutenance: null,
      status: "publié",
      uniteRecherche: "Institut de Recherche Biomédicale",
      fichierPdf: "these_moreau.pdf" ,
      encadrant: "Dr. Sophie Lefevre"  , 
      ecoleDoctorale: "École Doctorale Médecine"
    }
  ]);
  
  const filteredTheses = statusFilter === "tous" 
    ? theses 
    : theses.filter(these => these.status === statusFilter);
  
  const openValidationModal = (these: These) => {
    setSelectedThese(these);
    setIsValidationModalOpen(true);
  };

  const openPublishModal = (these: These) => {
    setSelectedThese(these);
    setIsPublishModalOpen(true);
  };
  
  const handlePublishThese = (theseId: string, isApproved: boolean) => {
    if (isApproved) {
      // Simulation de la mise à jour du statut
      setTheses(theses.map(t => 
        t.id === theseId ? { ...t, status: "publié" as const } : t
      ));
      
      toast.success("Thèse publiée et rendue accessible au public", {
        description: "Un email de notification a été envoyé au doctorant et au directeur de thèse."
      });
    }
    
    setIsPublishModalOpen(false);
  };
  
  const handleDownloadPdf = (these: These) => {
    toast.success(`Téléchargement du fichier "${these.fichierPdf}" en cours...`);
  };
  
  const handleValidateThese = (theseId: string, isApproved: boolean, comments: string) => {
    // Simulation de la mise à jour du statut
    setTheses(theses.map(t => {
      if (t.id === theseId) {
        return {
          ...t,
          status: isApproved ? "validé" as const : "rejeté" as const
        };
      }
      return t;
    }));
    
    toast.success(
      isApproved 
        ? "Thèse validée avec succès. Une notification a été envoyée au doctorant." 
        : "Thèse rejetée. Une notification a été envoyée au doctorant."
    );
    
    setIsValidationModalOpen(false);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thèses</CardTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setStatusFilter("tous")}>
                  Tous les statuts
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter("en_cours")}>
                  En cours
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter("soumis")}>
                  Soumis
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter("validé")}>
                  Validé
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter("rejeté")}>
                  Rejeté
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter("soutenu")}>
                  Soutenu
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter("en_attente")}>
                  En attente
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setStatusFilter("publié")}>
                  Publié
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Doctorant</TableHead>
                <TableHead>Directeur</TableHead>
                <TableHead>Encadrant</TableHead>
                <TableHead>Unité</TableHead>
                <TableHead>Date de dépôt</TableHead>
                <TableHead>Soutenance</TableHead>
                <TableHead>École doctorale</TableHead>
                {/* <TableHead>Date de soutenance</TableHead> */} 
                <TableHead>Statut</TableHead>
                {/* <TableHead>Encadrant</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTheses.map((these) => (
                <TableRow key={these.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {these.titre}
                  </TableCell>
                  <TableCell>{these.doctorant}</TableCell>
                  <TableCell>{these.directeur}</TableCell>
                  <TableCell>{these.encadrant}</TableCell>
            
                  <TableCell className="max-w-[150px] truncate">
                  
                    {these.uniteRecherche}
                  </TableCell>
                  <TableCell>{these.dateDepot}</TableCell>
                  <TableCell>
                    {these.dateSoutenance || "-"}
                  </TableCell>
                    <TableCell>{these.ecoleDoctorale}</TableCell>
                  <TableCell>
                    <StatusBadge status={these.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="ghost"
                        title="Télécharger le PDF"
                        onClick={() => handleDownloadPdf(these)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      {(these.status === "soumis" || these.status === "en_attente") && (
                        <>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-green-600"
                            title="Valider"
                            onClick={() => openValidationModal(these)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-red-600"
                            title="Rejeter"
                            onClick={() => openValidationModal(these)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {these.status === "validé" && (
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="text-blue-600"
                          title="Publier"
                          onClick={() => openPublishModal(these)}
                        >
                          <FileCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedThese && (
        <>
          <ValidationModal
            isOpen={isValidationModalOpen} 
            onClose={() => setIsValidationModalOpen(false)}
            these={selectedThese}
            onValidate={handleValidateThese}
          />
          
          <ValidationModal
            isOpen={isPublishModalOpen} 
            onClose={() => setIsPublishModalOpen(false)}
            these={selectedThese}
            onValidate={handlePublishThese}
            isPublishing={true}
          />
        </>
      )}
    </>
  );
}
