
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { getUserCampaigns } from '@/services/profileService';
import { fetchUserDonations, getDonationStats } from '@/services/donationService';

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [userCampaigns, setUserCampaigns] = useState<any[]>([]);
  const [userDonations, setUserDonations] = useState<any[]>([]);
  const [donationStats, setDonationStats] = useState({ count: 0, totalAmount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch user campaigns
        const campaigns = await getUserCampaigns(user.id);
        setUserCampaigns(campaigns);
        
        // Fetch user donations
        const donations = await fetchUserDonations(user.id);
        setUserDonations(donations);
        
        // Get donation stats
        const stats = await getDonationStats(user.id);
        setDonationStats(stats);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Chargement de votre tableau de bord...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bienvenue, {profile?.name}</h1>
          <p className="text-muted-foreground">{profile?.email}</p>
        </div>
        <Button onClick={() => navigate('/campaigns/create')}>
          Créer une campagne
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des dons effectués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(donationStats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">Sur {donationStats.count} dons</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Campagnes créées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCampaigns.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date d'inscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile && formatDate(profile.created_at)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Mes Campagnes</TabsTrigger>
          <TabsTrigger value="donations">Mes Dons</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-6">
          {userCampaigns.length > 0 ? (
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
                    {userCampaigns.map((campaign) => (
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
          ) : (
            <div className="text-center py-12 border rounded-md">
              <h3 className="font-medium mb-2">Vous n'avez pas encore créé de campagnes</h3>
              <p className="text-muted-foreground mb-4">Lancez votre première campagne de solidarité santé</p>
              <Button onClick={() => navigate('/campaigns/create')}>
                Créer une campagne
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="donations" className="mt-6">
          {userDonations.length > 0 ? (
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Campagne</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Montant</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDonations.map((donation) => (
                      <tr key={donation.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 align-middle">
                          <div className="font-medium">{donation.campaign?.title || 'Campagne inconnue'}</div>
                        </td>
                        <td className="p-4 align-middle font-semibold">
                          {formatCurrency(donation.amount)}
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
          ) : (
            <div className="text-center py-12 border rounded-md">
              <h3 className="font-medium mb-2">Vous n'avez pas encore fait de dons</h3>
              <p className="text-muted-foreground mb-4">Soutenez une cause qui vous tient à cœur</p>
              <Button onClick={() => navigate('/campaigns')}>
                Voir les campagnes
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
