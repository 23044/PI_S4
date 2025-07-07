
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Eye, UserCog, UserPlus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

// Définition des types
type Role = "admin" | "responsable" | "docteur" | "encadreur" | "doctorant";

type User = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  dateInscription: string;
  uniteRecherche: string;
};

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@universite.fr",
      role: "doctorant",
      dateInscription: "01/09/2022",
      uniteRecherche: "Laboratoire d'Informatique"
    },
    {
      id: "2",
      nom: "Martin",
      prenom: "Sophie",
      email: "sophie.martin@universite.fr",
      role: "doctorant",
      dateInscription: "01/10/2022",
      uniteRecherche: "Institut d'Océanographie"
    },
    {
      id: "3",
      nom: "Lambert",
      prenom: "Marie",
      email: "marie.lambert@universite.fr",
      role: "encadreur",
      dateInscription: "15/03/2019",
      uniteRecherche: "Laboratoire d'Informatique"
    },
    {
      id: "4",
      nom: "Dubois",
      prenom: "Pierre",
      email: "pierre.dubois@universite.fr",
      role: "responsable",
      dateInscription: "10/01/2018",
      uniteRecherche: "Institut d'Océanographie"
    },
    {
      id: "5",
      nom: "Moreau",
      prenom: "Jeanne",
      email: "jeanne.moreau@universite.fr",
      role: "admin",
      dateInscription: "05/05/2017",
      uniteRecherche: "Administration Centrale"
    }
  ]);

  const [roleFilter, setRoleFilter] = useState<string>("tous");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    nom: "",
    prenom: "",
    email: "",
    role: "doctorant",
    uniteRecherche: ""
  });

  const filteredUsers = roleFilter === "tous" 
    ? users 
    : users.filter(user => user.role === roleFilter);

  const handleAddUser = () => {
    if (!newUser.nom || !newUser.prenom || !newUser.email) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const id = (users.length + 1).toString();
    const today = new Date();
    const dateInscription = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const userToAdd: User = {
      id,
      nom: newUser.nom,
      prenom: newUser.prenom,
      email: newUser.email,
      role: (newUser.role as Role) || "doctorant",
      dateInscription,
      uniteRecherche: newUser.uniteRecherche || "Non assigné"
    };

    setUsers([...users, userToAdd]);
    setNewUser({
      nom: "",
      prenom: "",
      email: "",
      role: "doctorant",
      uniteRecherche: ""
    });
    setIsAddUserModalOpen(false);
    toast.success(`Utilisateur ${userToAdd.prenom} ${userToAdd.nom} ajouté avec succès`);
  };

  const handleEditUser = () => {
    if (!currentUser || !currentUser.nom || !currentUser.prenom || !currentUser.email) {
      toast.error("Informations utilisateur invalides");
      return;
    }

    const updatedUsers = users.map(user =>
      user.id === currentUser.id ? currentUser : user
    );

    setUsers(updatedUsers);
    setIsEditUserModalOpen(false);
    toast.success(`Utilisateur ${currentUser.prenom} ${currentUser.nom} modifié avec succès`);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) return;
    
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    toast.success(`Utilisateur ${userToDelete.prenom} ${userToDelete.nom} supprimé avec succès`);
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setIsEditUserModalOpen(true);
  };

  const getRoleLabel = (role: Role): string => {
    switch(role) {
      case "admin": return "Administrateur";
      case "responsable": return "Responsable";
      case "docteur": return "Docteur";
      case "encadreur": return "Encadreur";
      case "doctorant": return "Doctorant";
      default: return role;
    }
  };

  const getRoleBadgeClass = (role: Role): string => {
    switch(role) {
      case "admin": return "bg-red-100 text-red-800";
      case "responsable": return "bg-orange-100 text-orange-800";
      case "docteur": return "bg-blue-100 text-blue-800";
      case "encadreur": return "bg-purple-100 text-purple-800";
      case "doctorant": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Utilisateurs</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddUserModalOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
            <Select 
              value={roleFilter} 
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les rôles</SelectItem>
                <SelectItem value="admin">Administrateurs</SelectItem>
                <SelectItem value="responsable">Responsables</SelectItem>
                <SelectItem value="docteur">Docteurs</SelectItem>
                <SelectItem value="encadreur">Encadreurs</SelectItem>
                <SelectItem value="doctorant">Doctorants</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Unité de recherche</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.nom} {user.prenom}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {user.uniteRecherche}
                  </TableCell>
                  <TableCell>{user.dateInscription}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => openEditModal(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleDeleteUser(user.id)}  
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

      {/* Modal d'ajout d'utilisateur */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Complétez les informations pour créer un nouvel utilisateur
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={newUser.nom}
                  onChange={(e) => setNewUser({...newUser, nom: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={newUser.prenom}
                  onChange={(e) => setNewUser({...newUser, prenom: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rôle *</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser({...newUser, role: value as Role})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="responsable">Responsable</SelectItem>
                    <SelectItem value="docteur">Docteur</SelectItem>
                    <SelectItem value="encadreur">Encadreur</SelectItem>
                    <SelectItem value="doctorant">Doctorant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unite">Unité de recherche</Label>
                <Input
                  id="unite"
                  value={newUser.uniteRecherche}
                  onChange={(e) => setNewUser({...newUser, uniteRecherche: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddUser}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de modification d'utilisateur */}
      {currentUser && (
        <Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier l'utilisateur</DialogTitle>
              <DialogDescription>
                Modifier les informations de {currentUser.prenom} {currentUser.nom}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nom">Nom</Label>
                  <Input
                    id="edit-nom"
                    value={currentUser.nom}
                    onChange={(e) => setCurrentUser({...currentUser, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prenom">Prénom</Label>
                  <Input
                    id="edit-prenom"
                    value={currentUser.prenom}
                    onChange={(e) => setCurrentUser({...currentUser, prenom: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Rôle</Label>
                  <Select 
                    value={currentUser.role} 
                    onValueChange={(value) => setCurrentUser({...currentUser, role: value as Role})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="responsable">Responsable</SelectItem>
                      <SelectItem value="docteur">Docteur</SelectItem>
                      <SelectItem value="encadreur">Encadreur</SelectItem>
                      <SelectItem value="doctorant">Doctorant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unite">Unité de recherche</Label>
                  <Input
                    id="edit-unite"
                    value={currentUser.uniteRecherche}
                    onChange={(e) => setCurrentUser({...currentUser, uniteRecherche: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setIsEditUserModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEditUser}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
