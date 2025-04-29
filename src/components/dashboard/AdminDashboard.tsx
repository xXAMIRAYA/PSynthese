
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { dashboardStats, campaigns as mockCampaigns, users as mockUsers } from '@/services/mockData';
import { ArrowUp, Users, Target, HeartHandshake, Heart, Award, Calendar, PlusCircle, Edit, Trash } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(dashboardStats);
  
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <Button onClick={() => navigate('/admin/campaigns/new')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Campagne
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des dons</CardTitle>
            <Heart className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRaised)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-health-500" />
              <span>+12.5% depuis le mois dernier</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.donorsCount}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-health-500" />
              <span>+8.2% depuis le mois dernier</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campagnes actives</CardTitle>
            <Target className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedCampaigns} campagnes complétées
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            <HeartHandshake className="h-4 w-4 text-medical-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-health-500" />
              <span>+2.1% depuis le mois dernier</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
          <TabsTrigger value="donations">Dons récents</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-6 space-y-4">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Titre</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Catégorie</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date de fin</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Progrès</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Statut</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md overflow-hidden">
                            <img 
                              src={campaign.imageUrl} 
                              alt={campaign.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{campaign.title.substring(0, 40)}{campaign.title.length > 40 ? '...' : ''}</div>
                            <div className="text-xs text-muted-foreground">{campaign.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant="outline" className="capitalize">
                          {campaign.category}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        {formatDate(campaign.endDate)}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="w-40">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{Math.round((campaign.raised / campaign.target) * 100)}%</span>
                            <span>{formatCurrency(campaign.raised)}/{formatCurrency(campaign.target)}</span>
                          </div>
                          <Progress value={(campaign.raised / campaign.target) * 100} />
                        </div>
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
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/campaigns/${campaign.id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="donations" className="mt-6 space-y-4">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Donateur</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Campagne</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Montant</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentDonations.map((donation) => {
                    const user = mockUsers.find(u => u.id === donation.userId);
                    const campaign = mockCampaigns.find(c => c.id === donation.campaignId);
                    return (
                      <tr key={donation.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 align-middle">
                          {donation.anonymous ? (
                            <span className="text-muted-foreground">Anonyme</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                                {user?.avatarUrl ? (
                                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                  <Users className="h-4 w-4 m-auto" />
                                )}
                              </div>
                              <span>{user?.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          {campaign?.title.substring(0, 30)}{campaign?.title.length > 30 ? '...' : ''}
                        </td>
                        <td className="p-4 align-middle font-medium">
                          {formatCurrency(donation.amount)}
                        </td>
                        <td className="p-4 align-middle">
                          {formatDate(donation.createdAt)}
                        </td>
                        <td className="p-4 align-middle">
                          {donation.message ? (
                            <span className="italic text-xs">{donation.message.substring(0, 40)}{donation.message.length > 40 ? '...' : ''}</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">Aucun message</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6 space-y-4">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Utilisateur</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Rôle</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Dons</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Inscrit le</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                              <Users className="h-4 w-4 m-auto" />
                            )}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {user.email}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        {user.donationsCount || 0} ({formatCurrency(user.totalDonated || 0)})
                      </td>
                      <td className="p-4 align-middle">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
