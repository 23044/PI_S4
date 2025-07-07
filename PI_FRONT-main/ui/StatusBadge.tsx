
import { cn } from "@/lib/utils";

type StatusType = "en_cours" | "soumis" | "validé" | "rejeté" | "soutenu" | "en_attente" | "publié";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  en_cours: { label: "En cours", className: "bg-blue-100 text-blue-800" },
  soumis: { label: "Soumis", className: "bg-yellow-100 text-yellow-800" },
  validé: { label: "Validé", className: "bg-green-100 text-green-800" },
  rejeté: { label: "Rejeté", className: "bg-red-100 text-red-800" },
  soutenu: { label: "Soutenu", className: "bg-purple-100 text-purple-800" },
  en_attente: { label: "En attente", className: "bg-gray-100 text-gray-800" },
  publié: { label: "Publié", className: "bg-teal-100 text-teal-800" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn("px-2 py-1 text-xs font-medium rounded-full", config.className, className)}>
      {config.label}
    </span>
  );
}
