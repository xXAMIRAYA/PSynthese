
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserStatsProps {
  totalDonated: number;
  donationsCount: number;
  campaignsCount: number;
  createdAt: string | null;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string | null) => string;
}

const UserStats = ({ 
  totalDonated, 
  donationsCount, 
  campaignsCount, 
  createdAt, 
  formatCurrency, 
  formatDate 
}: UserStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total des dons effectués</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalDonated)}</div>
          <p className="text-xs text-muted-foreground mt-1">Sur {donationsCount} dons</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Campagnes créées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campaignsCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Date d'inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDate(createdAt)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
