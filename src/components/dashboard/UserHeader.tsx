import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UserHeaderProps {
  name: string | null;
  email: string | null;
  role: string | null;
}

const UserHeader = ({ name, email, role }: UserHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Bienvenue, {name}</h1>
        <p className="text-muted-foreground">{email}</p>
      </div>
      {role === 'campaign_manager' && (
        <Button onClick={() => navigate('/campaigns/create')}>
          Créer une campagne
        </Button>
      )}
    </div>
  );
};

export default UserHeader;
