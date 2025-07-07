
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { School, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

type ResearchUnit = {
  id: string;
  nom: string;
  departement: string;
  directeur: string;
  description: string;
};

type DoctoralSchool = {
  id: string;
  nom: string;
  description: string;
  unites: string[];
};

export function UnitsTable() {
  const [activeTab, setActiveTab] = useState("unites");
  
  // États pour les unités de recherche
  const [unites, setUnites] = useState<ResearchUnit[]>([
    {
      id: "1",
      nom: "Laboratoire d'Informatique",
      departement: "Sciences et Technologies",
      directeur: "Pr. Marie Lambert",
      description: "Laboratoire spécialisé dans la recherche en intelligence artificielle, sécurité informatique et systèmes distribués."
    },
    {
      id: "2",
      nom: "Institut d'Océanographie",
      departement: "Sciences de la Vie et de la Terre",
      directeur: "Dr. Pierre Dubois",
      description: "Institut dédié à l'étude des océans, de leur biodiversité et des impacts du changement climatique."
    },
    {
      id: "3",
      nom: "Laboratoire de Microbiologie",
      departement: "Sciences de la Vie et de la Terre",
      directeur: "Pr. Jeanne Moreau",
      description: "Recherche sur les micro-organismes, les antibiotiques et l'immunologie."
    },
    {
      id: "4",
      nom: "Centre d'Études Économiques",
      departement: "Sciences Humaines et Sociales",
      directeur: "Dr. Marc Durand",
      description: "Analyses économiques, modèles mathématiques et études de marché."
    }
  ]);
  
  // États pour les écoles doctorales
  const [ecoles, setEcoles] = useState<DoctoralSchool[]>([
    {
      id: "1",
      nom: "École Doctorale Sciences et Technologies",
      description: "Formation doctorale dans les domaines des sciences fondamentales et appliquées.",
      unites: ["Laboratoire d'Informatique", "Institut de Mathématiques Appliquées"]
    },
    {
      id: "2",
      nom: "École Doctorale Sciences de la Vie",
      description: "Formation doctorale dans les domaines de la biologie, de l'écologie et de la santé.",
      unites: ["Institut d'Océanographie", "Laboratoire de Microbiologie"]
    },
    {
      id: "3",
      nom: "École Doctorale Sciences Humaines",
      description: "Formation doctorale dans les domaines de l'économie, de la sociologie et de la psychologie.",
      unites: ["Centre d'Études Économiques"]
    }
  ]);
  
  // États pour les modals
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState(false);
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState(false);
  const [isEditSchoolModalOpen, setIsEditSchoolModalOpen] = useState(false);
  
  // États pour l'édition/création
  const [currentUnit, setCurrentUnit] = useState<ResearchUnit | null>(null);
  const [currentSchool, setCurrentSchool] = useState<DoctoralSchool | null>(null);
  const [newUnit, setNewUnit] = useState<Partial<ResearchUnit>>({
    nom: "",
    departement: "",
    directeur: "",
    description: ""
  });
  const [newSchool, setNewSchool] = useState<Partial<DoctoralSchool>>({
    nom: "",
    description: "",
    unites: []
  });
  
  // Fonctions pour les unités de recherche
  const handleAddUnit = () => {
    if (!newUnit.nom || !newUnit.directeur) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    
    const unitToAdd: ResearchUnit = {
      id: (unites.length + 1).toString(),
      nom: newUnit.nom,
      departement: newUnit.departement || "",
      directeur: newUnit.directeur,
      description: newUnit.description || ""
    };
    
    setUnites([...unites, unitToAdd]);
    setNewUnit({
      nom: "",
      departement: "",
      directeur: "",
      description: ""
    });
    setIsAddUnitModalOpen(false);
    toast.success(`Unité de recherche "${unitToAdd.nom}" ajoutée avec succès`);
  };
  
  const handleEditUnit = () => {
    if (!currentUnit || !currentUnit.nom || !currentUnit.directeur) {
      toast.error("Informations unité invalides");
      return;
    }
    
    const updatedUnits = unites.map(unit =>
      unit.id === currentUnit.id ? currentUnit : unit
    );
    
    setUnites(updatedUnits);
    setIsEditUnitModalOpen(false);
    toast.success(`Unité de recherche "${currentUnit.nom}" modifiée avec succès`);
  };
  
  const handleDeleteUnit = (unitId: string) => {
    const unitToDelete = unites.find(unit => unit.id === unitId);
    if (!unitToDelete) return;
    
    // Vérifier si l'unité est utilisée par des écoles doctorales
    const usedBySchools = ecoles.filter(school => 
      school.unites.includes(unitToDelete.nom)
    );
    
    if (usedBySchools.length > 0) {
      toast.error(`Impossible de supprimer cette unité car elle est utilisée par ${usedBySchools.length} école(s) doctorale(s)`);
      return;
    }
    
    const updatedUnits = unites.filter(unit => unit.id !== unitId);
    setUnites(updatedUnits);
    toast.success(`Unité de recherche "${unitToDelete.nom}" supprimée avec succès`);
  };
  
  const openEditUnitModal = (unit: ResearchUnit) => {
    setCurrentUnit(unit);
    setIsEditUnitModalOpen(true);
  };
  
  // Fonctions pour les écoles doctorales
  const handleAddSchool = () => {
    if (!newSchool.nom) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    
    const schoolToAdd: DoctoralSchool = {
      id: (ecoles.length + 1).toString(),
      nom: newSchool.nom,
      description: newSchool.description || "",
      unites: newSchool.unites || []
    };
    
    setEcoles([...ecoles, schoolToAdd]);
    setNewSchool({
      nom: "",
      description: "",
      unites: []
    });
    setIsAddSchoolModalOpen(false);
    toast.success(`École doctorale "${schoolToAdd.nom}" ajoutée avec succès`);
  };
  
  const handleEditSchool = () => {
    if (!currentSchool || !currentSchool.nom) {
      toast.error("Informations école invalides");
      return;
    }
    
    const updatedSchools = ecoles.map(school =>
      school.id === currentSchool.id ? currentSchool : school
    );
    
    setEcoles(updatedSchools);
    setIsEditSchoolModalOpen(false);
    toast.success(`École doctorale "${currentSchool.nom}" modifiée avec succès`);
  };
  
  const handleDeleteSchool = (schoolId: string) => {
    const schoolToDelete = ecoles.find(school => school.id === schoolId);
    if (!schoolToDelete) return;
    
    const updatedSchools = ecoles.filter(school => school.id !== schoolId);
    setEcoles(updatedSchools);
    toast.success(`École doctorale "${schoolToDelete.nom}" supprimée avec succès`);
  };
  
  const openEditSchoolModal = (school: DoctoralSchool) => {
    setCurrentSchool(school);
    setIsEditSchoolModalOpen(true);
  };
  
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="unites">Unités de recherche</TabsTrigger>
          <TabsTrigger value="ecoles">Écoles doctorales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unites">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Unités de recherche</CardTitle>
              <Button onClick={() => setIsAddUnitModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une unité
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Directeur</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unites.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.nom}</TableCell>
                      <TableCell>{unit.departement}</TableCell>
                      <TableCell>{unit.directeur}</TableCell>
                      <TableCell className="max-w-xs truncate">{unit.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => openEditUnitModal(unit)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => handleDeleteUnit(unit.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ecoles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Écoles doctorales</CardTitle>
              <Button onClick={() => setIsAddSchoolModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une école
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Unités associées</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ecoles.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.nom}</TableCell>
                      <TableCell className="max-w-xs truncate">{school.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {school.unites.map((unite, index) => (
                            <span 
                              key={index} 
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {unite}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => openEditSchoolModal(school)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => handleDeleteSchool(school.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modal d'ajout d'unité de recherche */}
      <Dialog open={isAddUnitModalOpen} onOpenChange={setIsAddUnitModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une unité de recherche</DialogTitle>
            <DialogDescription>
              Complétez les informations pour créer une nouvelle unité de recherche
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom-unite">Nom de l'unité *</Label>
              <Input
                id="nom-unite"
                value={newUnit.nom}
                onChange={(e) => setNewUnit({...newUnit, nom: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departement">Département</Label>
              <Input
                id="departement"
                value={newUnit.departement}
                onChange={(e) => setNewUnit({...newUnit, departement: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="directeur">Directeur *</Label>
              <Input
                id="directeur"
                value={newUnit.directeur}
                onChange={(e) => setNewUnit({...newUnit, directeur: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description-unite">Description</Label>
              <Textarea
                id="description-unite"
                value={newUnit.description}
                onChange={(e) => setNewUnit({...newUnit, description: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setIsAddUnitModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddUnit}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'édition d'unité de recherche */}
      {currentUnit && (
        <Dialog open={isEditUnitModalOpen} onOpenChange={setIsEditUnitModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier l'unité de recherche</DialogTitle>
              <DialogDescription>
                Modifier les informations de l'unité "{currentUnit.nom}"
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nom-unite">Nom de l'unité *</Label>
                <Input
                  id="edit-nom-unite"
                  value={currentUnit.nom}
                  onChange={(e) => setCurrentUnit({...currentUnit, nom: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-departement">Département</Label>
                <Input
                  id="edit-departement"
                  value={currentUnit.departement}
                  onChange={(e) => setCurrentUnit({...currentUnit, departement: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-directeur">Directeur *</Label>
                <Input
                  id="edit-directeur"
                  value={currentUnit.directeur}
                  onChange={(e) => setCurrentUnit({...currentUnit, directeur: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description-unite">Description</Label>
                <Textarea
                  id="edit-description-unite"
                  value={currentUnit.description}
                  onChange={(e) => setCurrentUnit({...currentUnit, description: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setIsEditUnitModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEditUnit}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Modal d'ajout d'école doctorale */}
      <Dialog open={isAddSchoolModalOpen} onOpenChange={setIsAddSchoolModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une école doctorale</DialogTitle>
            <DialogDescription>
              Complétez les informations pour créer une nouvelle école doctorale
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom-ecole">Nom de l'école *</Label>
              <Input
                id="nom-ecole"
                value={newSchool.nom}
                onChange={(e) => setNewSchool({...newSchool, nom: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description-ecole">Description</Label>
              <Textarea
                id="description-ecole"
                value={newSchool.description}
                onChange={(e) => setNewSchool({...newSchool, description: e.target.value})}
                rows={3}
              />
            </div>
            
            {/* Ici on pourrait ajouter un sélecteur multiple pour les unités de recherche */}
          </div>
          
          <DialogFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setIsAddSchoolModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddSchool}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'édition d'école doctorale */}
      {currentSchool && (
        <Dialog open={isEditSchoolModalOpen} onOpenChange={setIsEditSchoolModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier l'école doctorale</DialogTitle>
              <DialogDescription>
                Modifier les informations de l'école "{currentSchool.nom}"
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nom-ecole">Nom de l'école *</Label>
                <Input
                  id="edit-nom-ecole"
                  value={currentSchool.nom}
                  onChange={(e) => setCurrentSchool({...currentSchool, nom: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description-ecole">Description</Label>
                <Textarea
                  id="edit-description-ecole"
                  value={currentSchool.description}
                  onChange={(e) => setCurrentSchool({...currentSchool, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              {/* Ici on pourrait ajouter un sélecteur multiple pour les unités de recherche */}
            </div>
            
            <DialogFooter className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setIsEditSchoolModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEditSchool}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
