
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Doctorant = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  dateNaissance: string;
  directeurThese: string;
  encadrant: string;
  uniteRecherche: string;
  dateInscription: string;
};

export function DoctorantsTable() {
  const doctorants: Doctorant[] = [
    {
      id: "1",
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@universite.fr",
      dateNaissance: "15/04/1995",
      directeurThese: "Pr. Marie Lambert",
      encadrant: "Dr. Pierre Dubois",
      uniteRecherche: "Laboratoire d'Informatique",
      dateInscription: "01/09/2022"
    },
    {
      id: "2",
      nom: "Martin",
      prenom: "Sophie",
      email: "sophie.martin@universite.fr",
      dateNaissance: "22/07/1994",
      directeurThese: "Dr. Pierre Dubois",
      encadrant: "Pr. Marie Lambert",
      uniteRecherche: "Institut d'Océanographie",
      dateInscription: "01/10/2022"
    },
    {
      id: "3",
      nom: "Bernard",
      prenom: "Thomas",
      email: "thomas.bernard@universite.fr",
      dateNaissance: "03/12/1993",
      directeurThese: "Pr. Jeanne Moreau",
      encadrant: "Dr. Marc Durand",
      uniteRecherche: "Laboratoire de Microbiologie",
      dateInscription: "15/09/2021"
    },
    {
      id: "4",
      nom: "Petit",
      prenom: "Lucie",
      email: "lucie.petit@universite.fr",
      dateNaissance: "30/01/1996",
      directeurThese: "Dr. Marc Durand",
      encadrant: "Pr. Sylvie Lefevre",
      uniteRecherche: "Centre d'Études Économiques",
      dateInscription: "01/09/2022"
    },
    {
      id: "5",
      nom: "Leroy",
      prenom: "Éric",
      email: "eric.leroy@universite.fr",
      dateNaissance: "10/05/1991",
      directeurThese: "Pr. Sylvie Lefevre",
      encadrant: "Dr. Pierre Dubois",
      uniteRecherche: "Institut de Mathématiques Appliquées",
      dateInscription: "01/09/2021"
    }
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Doctorants</CardTitle>
        <Select defaultValue="tous">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par unité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Toutes les unités</SelectItem>
            <SelectItem value="info">Laboratoire d'Informatique</SelectItem>
            <SelectItem value="ocean">Institut d'Océanographie</SelectItem>
            <SelectItem value="micro">Laboratoire de Microbiologie</SelectItem>
            <SelectItem value="eco">Centre d'Études Économiques</SelectItem>
            <SelectItem value="math">Institut de Mathématiques</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date de naissance</TableHead>
              <TableHead>Directeur de thèse</TableHead>
              <TableHead>Encadrant</TableHead>
              <TableHead>Unité de recherche</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctorants.map((doctorant) => (
              <TableRow key={doctorant.id}>
                <TableCell className="font-medium">
                  {doctorant.nom} {doctorant.prenom}
                </TableCell>
                <TableCell>{doctorant.email}</TableCell>
                <TableCell>{doctorant.dateNaissance}</TableCell>
                <TableCell>{doctorant.directeurThese}</TableCell>
                <TableCell>{doctorant.encadrant}</TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {doctorant.uniteRecherche}
                </TableCell>
                <TableCell>{doctorant.dateInscription}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <UserCog className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
