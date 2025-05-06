
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Campaign {
  id: string;
  title: string;
  category: 'emergency' | 'research' | 'equipment' | 'care' | 'awareness';
  raised: number;
  target: number;
  status: 'active' | 'completed' | 'urgent';
}

interface UserCampaignsTableProps {
  campaigns: Campaign[];
  formatCurrency: (amount: number) => string;
}

const UserCampaignsTable = ({ campaigns, formatCurrency }: UserCampaignsTableProps) => {
  const navigate = useNavigate();
  
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <h3 className="font-medium mb-2">Vous n'avez pas encore créé de campagnes</h3>
        <p className="text-muted-foreground mb-4">Lancez votre première campagne de solidarité santé</p>
        <Button onClick={() => navigate('/campaigns/create')}>
          Créer une campagne
        </Button>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Titre</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Catégorie</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Montant collecté</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Statut</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="p-4 align-middle">
                  <div className="font-medium">{campaign.title}</div>
                </td>
                <td className="p-4 align-middle">
                  <Badge variant="outline" className="capitalize">
                    {campaign.category}
                  </Badge>
                </td>
                <td className="p-4 align-middle">
                  {formatCurrency(campaign.raised)} / {formatCurrency(campaign.target)}
                </td>
                <td className="p-4 align-middle">
                  <Badge 
                    variant={
                      campaign.status === 'urgent' ? 'destructive' : 
                      campaign.status === 'completed' ? 'secondary' : 
                      'default'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </td>
                <td className="p-4 align-middle">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/campaign/${campaign.id}`)}>
                    Voir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserCampaignsTable;
