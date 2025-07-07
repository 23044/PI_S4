
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useState } from "react";
import { toast } from "sonner";

type These = {
  id: string;
  titre: string;
  doctorant: string;
  directeur: string;
  dateDepot: string;
  dateSoutenance: string | null;
  status: "en_cours" | "soumis" | "validé" | "rejeté" | "soutenu" | "en_attente" | "publié";
  uniteRecherche: string;
};

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  these: These;
  onValidate: (theseId: string, isApproved: boolean, comments: string) => void;
  isPublishing?: boolean;
}

export function ValidationModal({ isOpen, onClose, these, onValidate, isPublishing = false }: ValidationModalProps) {
  const [comments, setComments] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  
  const handleValidate = () => {
    onValidate(these.id, true, comments);
    onClose();
  };
  
  const handleReject = () => {
    if (!comments && isRejecting) {
      toast.error("Veuillez fournir un commentaire pour le rejet");
      return;
    }
    
    if (!isRejecting) {
      setIsRejecting(true);
      return;
    }
    
    onValidate(these.id, false, comments);
    onClose();
  };
  
  const handlePublish = () => {
    onValidate(these.id, true, comments);
    onClose();
  };
  
  const resetAndClose = () => {
    setComments("");
    setIsRejecting(false);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isPublishing ? "Publication de la thèse" : "Validation de la thèse"}
          </DialogTitle>
          <DialogDescription>
            {isPublishing 
              ? "Voulez-vous publier cette thèse et la rendre accessible au public?"
              : isRejecting 
                ? "Veuillez fournir une raison pour le rejet de cette thèse"
                : "Veuillez valider ou rejeter cette thèse"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <p className="text-sm font-medium">{these.titre}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Doctorant</Label>
              <p className="text-sm">{these.doctorant}</p>
            </div>
            <div className="space-y-2">
              <Label>Directeur</Label>
              <p className="text-sm">{these.directeur}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de dépôt</Label>
              <p className="text-sm">{these.dateDepot}</p>
            </div>
            <div className="space-y-2">
              <Label>Statut actuel</Label>
              <StatusBadge status={these.status} />
            </div>
          </div>
          
          {!isPublishing && (
            <div className="space-y-2">
              <Label htmlFor="comments">
                {isRejecting ? "Raison du rejet (obligatoire)" : "Commentaires (optionnel)"}
              </Label>
              <Textarea
                id="comments"
                placeholder={isRejecting 
                  ? "Veuillez expliquer pourquoi cette thèse est rejetée..."
                  : "Ajoutez vos commentaires (obligatoire en cas de rejet)"}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between gap-2">
          {isPublishing ? (
            <>
              <Button variant="outline" onClick={resetAndClose}>
                Annuler
              </Button>
              <Button onClick={handlePublish}>
                Publier
              </Button>
            </>
          ) : isRejecting ? (
            <>
              <Button variant="outline" onClick={() => setIsRejecting(false)}>
                Retour
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Confirmer le rejet
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={resetAndClose}>
                Annuler
              </Button>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleReject}>
                  Rejeter
                </Button>
                <Button onClick={handleValidate}>
                  Valider
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
