import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, User } from "lucide-react";

interface CampaignCardProps {
  campaign: {
    id: string;
    title: string;
    category: string;
    location: string;
    target: number;
    raised: number;
    image_url: string;
    status: string;
    end_date: string;
    organizer: {
      name: string;
      avatar_url?: string;
    };
  };
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const navigate = useNavigate();

  const currentDate = new Date();
  const campaignEndDate = new Date(campaign.end_date);

  const isExpired = campaignEndDate < currentDate;
  const isBudgetReached = campaign.raised >= campaign.target;

  if (isExpired || isBudgetReached) {
    return null;
  }

  const progressPercentage = Math.min(
    Math.round((campaign.raised / campaign.target) * 100),
    100
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "emergency":
        return "Urgence";
      case "research":
        return "Recherche";
      case "equipment":
        return "Équipement";
      case "awareness":
        return "Sensibilisation";
      case "care":
        return "Soins";
      default:
        return category;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={campaign.image_url || "/placeholder.svg"}
          alt={campaign.title}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge
            variant={campaign.status === "urgent" ? "destructive" : "default"}
          >
            {campaign.status === "urgent"
              ? "Urgent"
              : campaign.status === "completed"
              ? "Complété"
              : "Actif"}
          </Badge>
        </div>
      </div>

      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            {getCategoryLabel(campaign.category)}
          </Badge>
        </div>

        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          {campaign.title}
        </h3>

        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{campaign.location}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>Fin : {formatDate(campaign.end_date)}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <User className="h-3.5 w-3.5 mr-1" />
          <span>{campaign.organizer?.name || "Inconnu"}</span>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{progressPercentage}%</span>
            <span>
              {formatCurrency(campaign.raised)} / {formatCurrency(campaign.target)}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={() => navigate(`/campaign/${campaign.id}`)}
          className="w-full"
        >
          Voir la campagne
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
