
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Donation {
  id: string;
  type:string ;
  amount: number;
  created_at: string;
  campaign?: {
    id: string;
    title: string;
  };
}

interface UserDonationsTableProps {
  donations: Donation[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string | null) => string;
}

const UserDonationsTable = ({ donations, formatCurrency, formatDate }: UserDonationsTableProps) => {
  const navigate = useNavigate();
  
  if (donations.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <h3 className="font-medium mb-2">Vous n'avez pas encore fait de dons</h3>
        <p className="text-muted-foreground mb-4">Soutenez une cause qui vous tient à cœur</p>
        <Button onClick={() => navigate('/campaigns')}>
          Voir les campagnes
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
              <th className="h-12 px-4 text-left align-middle font-medium">Campagne</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Type de donation </th>
              <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="p-4 align-middle">
                  <div className="font-medium">{donation.campaign?.title || 'Campagne inconnue'}</div>
                </td>
            
              <td className="p-4 align-middle font-semibold">
  {donation.type === "argent"
    ? `Argent : ${formatCurrency(donation.amount)}`
    : donation.type}
</td>

                <td className="p-4 align-middle">
                  {formatDate(donation.created_at)}
                </td>
                <td className="p-4 align-middle">
                  {donation.campaign?.id && (
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/campaign/${donation.campaign.id}`)}>
                      Voir la campagne
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDonationsTable;
