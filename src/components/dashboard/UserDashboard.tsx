
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { donations as mockDonations, campaigns as mockCampaigns } from '@/services/mockData';
import { Heart, Award, Calendar } from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const [userDonations, setUserDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // In a real app, this would be an API call
    setIsLoading(true);
    setTimeout(() => {
      const userDonationData = mockDonations.filter(donation => donation.userId === user.id);
      setUserDonations(userDonationData);
      setIsLoading(false);
    }, 500);
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  // For demo purposes, calculate stats
  const totalDonated = userDonations.reduce((acc: number, donation: any) => acc + donation.amount, 0);
  const campaignsSupported = [...new Set(userDonations.map((donation: any) => donation.campaignId))].length;
  
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
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Bienvenue, {user?.name}</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donné</CardTitle>
            <Heart className="h-4 w-4 text-medical-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDonated)}</div>
            <p className="text-xs text-muted-foreground">
              Merci pour votre générosité
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dons Effectués</CardTitle>
            <Calendar className="h-4 w-4 text-medical-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userDonations.length}</div>
            <p className="text-xs text-muted-foreground">
              Campagnes soutenues: {campaignsSupported}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
            <Award className="h-4 w-4 text-medical-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.badges?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Continuez à soutenir pour en obtenir plus
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="donations">
        <TabsList>
          <TabsTrigger value="donations">Mes Dons</TabsTrigger>
          <TabsTrigger value="badges">Mes Badges</TabsTrigger>
          <TabsTrigger value="impact">Mon Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="donations" className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Historique de vos dons</h2>
          
          {userDonations.length > 0 ? (
            <div className="space-y-4">
              {userDonations.map((donation: any) => {
                const campaign = mockCampaigns.find(c => c.id === donation.campaignId);
                return (
                  <Card key={donation.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img 
                          src={campaign?.imageUrl || 'https://via.placeholder.com/150'} 
                          alt={campaign?.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{campaign?.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(donation.createdAt)}
                        </p>
                        {donation.message && (
                          <p className="text-sm mt-1 italic">"{donation.message}"</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(donation.amount)}</p>
                        {donation.anonymous && (
                          <Badge variant="outline" className="mt-1">Anonyme</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium">Aucun don effectué</h3>
              <p className="text-muted-foreground">Commencez à soutenir des campagnes dès aujourd'hui</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="badges" className="mt-6">
          {user?.badges && user.badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.badges.map((badge) => (
                <Card key={badge.id} className="overflow-hidden">
                  <div className="p-4 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-3 badge-animation">
                      <Award className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-medium">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {badge.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium">Aucun badge débloqué</h3>
              <p className="text-muted-foreground">Continuez à soutenir des campagnes pour gagner des badges</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="impact" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Votre impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Soutien financier</span>
                      <span className="text-sm text-muted-foreground">{formatCurrency(totalDonated)}</span>
                    </div>
                    <Progress value={Math.min((totalDonated / 1000) * 100, 100)} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Campagnes soutenues</span>
                      <span className="text-sm text-muted-foreground">{campaignsSupported}/10</span>
                    </div>
                    <Progress value={(campaignsSupported / 10) * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Niveau d'engagement</span>
                      <span className="text-sm text-muted-foreground">Supporteur</span>
                    </div>
                    <Progress value={30} />
                  </div>
                  
                  <div className="bg-accent p-4 rounded-lg mt-6">
                    <h4 className="font-medium">Prochains objectifs:</h4>
                    <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                      <li>Faire un don à 5 campagnes différentes</li>
                      <li>Atteindre 1000€ de dons cumulés</li>
                      <li>Débloquer le badge "Philanthrope"</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
