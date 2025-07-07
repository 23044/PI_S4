
import { Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center w-1/3 relative">
          <Search size={18} className="absolute left-3 text-slate-400" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-10 bg-slate-50"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Administrateur</span>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
