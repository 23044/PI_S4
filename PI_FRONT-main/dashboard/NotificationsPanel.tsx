
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye, Send, Trash2, Bell } from "lucide-react";
import { toast } from "sonner";

type Notification = {
  id: string;
  sujet: string;
  destinataire: string;
  destinataireEmail: string;
  message: string;
  date: string;
  lue: boolean;
};

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      sujet: "Thèse validée",
      destinataire: "Jean Dupont",
      destinataireEmail: "jean.dupont@universite.fr",
      message: "Votre thèse 'Optimisation des performances des algorithmes d'apprentissage automatique' a été validée. Vous pouvez désormais procéder aux étapes suivantes de votre parcours doctoral.",
      date: "15/04/2023",
      lue: true
    },
    {
      id: "2",
      sujet: "Demande de modification",
      destinataire: "Sophie Martin",
      destinataireEmail: "sophie.martin@universite.fr",
      message: "Des modifications sont requises pour votre thèse 'Impact des changements climatiques sur la biodiversité marine'. Veuillez consulter les commentaires du comité et soumettre une version révisée.",
      date: "20/04/2023",
      lue: false
    },
    {
      id: "3",
      sujet: "Rappel: Date limite d'inscription",
      destinataire: "Thomas Bernard",
      destinataireEmail: "thomas.bernard@universite.fr",
      message: "Rappel: La date limite d'inscription pour l'année académique 2023-2024 est fixée au 30 septembre. Assurez-vous de compléter toutes les formalités administratives avant cette échéance.",
      date: "01/05/2023",
      lue: true
    },
    {
      id: "4",
      sujet: "Soutenance planifiée",
      destinataire: "Lucie Petit",
      destinataireEmail: "lucie.petit@universite.fr",
      message: "Votre soutenance de thèse a été planifiée pour le 12 juillet 2023 à 14h00 dans l'amphithéâtre A. Veuillez confirmer votre disponibilité.",
      date: "10/05/2023",
      lue: false
    }
  ]);

  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [newNotification, setNewNotification] = useState({
    sujet: "",
    destinataire: "",
    destinataireEmail: "",
    message: ""
  });

  const handleDeleteNotification = (notifId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notifId);
    setNotifications(updatedNotifications);
    toast.success("Notification supprimée avec succès");
  };

  const handleSendNotification = () => {
    if (!newNotification.sujet || !newNotification.destinataire || !newNotification.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const today = new Date();
    const date = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const notifToAdd: Notification = {
      id: (notifications.length + 1).toString(),
      sujet: newNotification.sujet,
      destinataire: newNotification.destinataire,
      destinataireEmail: newNotification.destinataireEmail,
      message: newNotification.message,
      date: date,
      lue: false
    };

    setNotifications([notifToAdd, ...notifications]);
    setNewNotification({
      sujet: "",
      destinataire: "",
      destinataireEmail: "",
      message: ""
    });
    setIsComposeModalOpen(false);
    toast.success("Notification envoyée avec succès");
  };

  const viewNotification = (notif: Notification) => {
    setCurrentNotification(notif);
    
    // Marquer comme lue si ce n'est pas déjà le cas
    if (!notif.lue) {
      const updatedNotifications = notifications.map(n => 
        n.id === notif.id ? { ...n, lue: true } : n
      );
      setNotifications(updatedNotifications);
    }
    
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Button onClick={() => setIsComposeModalOpen(true)}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer une notification
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">État</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Destinataire</TableHead>
                  <TableHead>Date d'envoi</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Aucune notification à afficher
                    </TableCell>
                  </TableRow>
                ) : (
                  notifications.map((notif) => (
                    <TableRow key={notif.id} className={notif.lue ? "" : "bg-blue-50"}>
                      <TableCell>
                        <div className="flex justify-center">
                          {!notif.lue && (
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{notif.sujet}</TableCell>
                      <TableCell>{notif.destinataire}</TableCell>
                      <TableCell>{notif.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => viewNotification(notif)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => handleDeleteNotification(notif.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal de composition de notification */}
      <Dialog open={isComposeModalOpen} onOpenChange={setIsComposeModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Envoyer une notification</DialogTitle>
            <DialogDescription>
              Composez une notification à envoyer à un utilisateur
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sujet">Sujet *</Label>
              <Input
                id="sujet"
                value={newNotification.sujet}
                onChange={(e) => setNewNotification({...newNotification, sujet: e.target.value})}
                placeholder="Sujet de la notification"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destinataire">Destinataire *</Label>
                <Input
                  id="destinataire"
                  value={newNotification.destinataire}
                  onChange={(e) => setNewNotification({...newNotification, destinataire: e.target.value})}
                  placeholder="Nom du destinataire"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newNotification.destinataireEmail}
                  onChange={(e) => setNewNotification({...newNotification, destinataireEmail: e.target.value})}
                  placeholder="Email du destinataire"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                placeholder="Contenu de la notification..."
                rows={6}
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => setIsComposeModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendNotification}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de visualisation de notification */}
      {currentNotification && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentNotification.sujet}</DialogTitle>
              <DialogDescription>
                Envoyée à {currentNotification.destinataire} le {currentNotification.date}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="whitespace-pre-wrap">{currentNotification.message}</p>
              </div>
              
              {currentNotification.destinataireEmail && (
                <div className="text-sm text-muted-foreground">
                  Email: {currentNotification.destinataireEmail}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
