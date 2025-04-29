
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Heart } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error("404 Error: Route not found");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Heart className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-4">Page non trouvée</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
        <Button variant="outline" onClick={() => navigate('/campaigns')}>
          Explorer les campagnes
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
