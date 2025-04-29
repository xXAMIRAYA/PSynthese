
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Campaign } from "@/types";
import { Link } from "react-router-dom";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const progressPercentage = Math.min(Math.round((campaign.raised / campaign.target) * 100), 100);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  // Get status badge color
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'destructive';
      case 'completed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Link to={`/campaign/${campaign.id}`} className="block">
      <Card className="campaign-card h-full overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={campaign.imageUrl} 
            alt={campaign.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <Badge 
            variant={getBadgeVariant(campaign.status)} 
            className="absolute top-3 right-3"
          >
            {campaign.status === 'urgent' ? 'Urgent' : 
             campaign.status === 'completed' ? 'Complété' : 'Actif'}
          </Badge>
          <Badge className="absolute top-3 left-3">
            {campaign.category === 'emergency' ? 'Urgence' : 
             campaign.category === 'research' ? 'Recherche' : 
             campaign.category === 'equipment' ? 'Équipement' :
             campaign.category === 'awareness' ? 'Sensibilisation' : 'Soins'}
          </Badge>
        </div>
        <CardHeader className="py-4">
          <h3 className="font-bold text-lg line-clamp-2">{campaign.title}</h3>
          <p className="text-muted-foreground text-sm">{campaign.location}</p>
        </CardHeader>
        <CardContent>
          <div className="text-sm line-clamp-3 mb-4">
            {campaign.description}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{progressPercentage}% complété</span>
              <span className="text-sm text-muted-foreground">{formatCurrency(campaign.raised)} / {formatCurrency(campaign.target)}</span>
            </div>
            <Progress value={progressPercentage} className="progress-bar-animation" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <span>Par {campaign.organizer}</span>
          <span>{campaign.donorsCount} donateurs</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CampaignCard;
