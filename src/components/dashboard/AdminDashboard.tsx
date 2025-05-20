import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ArrowUp, Users, Target, HeartHandshake, Heart, Award, Calendar, PlusCircle, Edit, Trash, AlertCircle } from "lucide-react";
import EditCampaign from "@/components/Edit/EditCampaign";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour stocker les données de Supabase
  const [stats, setStats] = useState({
    totalRaised: 0,
    donorsCount: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    recentDonations: []
  });
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Fonction pour charger les statistiques globales
  const fetchStats = async () => {
    try {
      // Total des dons
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('amount');

      if (donationsError) throw donationsError;

      const totalRaised = donationsData.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);

      // Nombre de donateurs uniques
      const { data: donorsData, error: donorsError } = await supabase
        .from('donations')
        .select('user_id')
        .order('user_id');

      if (donorsError) throw donorsError;

      const uniqueDonors = new Set(donorsData.map(donation => donation.user_id)).size;

      // Nombre de campagnes actives et complétées
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('status');

      if (campaignsError) throw campaignsError;

      const activeCampaigns = campaignsData.filter(campaign => campaign.status === 'active' || campaign.status === 'urgent').length;
      const completedCampaigns = campaignsData.filter(campaign => campaign.status === 'completed').length;

      // Récupérer les dons récents avec les détails nécessaires
      const { data: recentDonations, error: recentDonationsError } = await supabase
        .from('donations')
        .select(`
          id,
          amount,
          message,
          anonymous,
          created_at,
          user_id,
          campaign_id
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentDonationsError) throw recentDonationsError;

      setStats({
        totalRaised,
        donorsCount: uniqueDonors,
        activeCampaigns,
        completedCampaigns,
        recentDonations
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setError("Impossible de charger les statistiques. Veuillez réessayer plus tard.");
    }
  };

  // Fonction pour charger les campagnes
  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          id,
          title,
          description,
          category,
          location,
          target,
          raised,
          image_url,
          end_date,
          status,
          organizer_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCampaigns(data);
    } catch (error) {
      console.error("Erreur lors du chargement des campagnes:", error);
      setError("Impossible de charger les campagnes. Veuillez réessayer plus tard.");
    }
  };

  // Fonction pour charger les utilisateurs
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          avatar_url,
          role,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Pour chaque utilisateur, calculer son nombre de dons et le montant total
      const usersWithDonationInfo = await Promise.all(data.map(async (user) => {
        const { data: userDonations, error: donationsError } = await supabase
          .from('donations')
          .select('amount')
          .eq('user_id', user.id);

        if (donationsError) throw donationsError;

        const donationsCount = userDonations.length;
        const totalDonated = userDonations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);

        return {
          ...user,
          donationsCount,
          totalDonated
        };
      }));

      setUsers(usersWithDonationInfo);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setError("Impossible de charger les utilisateurs. Veuillez réessayer plus tard.");
    }
  };

  // Fonction pour charger les dons détaillés
  const fetchDetailedDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          id,
          amount,
          message,
          anonymous,
          created_at,
          user_id,
          campaign_id
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setDonations(data);
    } catch (error) {
      console.error("Erreur lors du chargement des dons:", error);
      setError("Impossible de charger les dons. Veuillez réessayer plus tard.");
    }
  };

  // Supprimer une campagne
  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette campagne ? Cette action est irréversible.");
      if (!confirmed) return;

      setLoading(true);

      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", campaignId);

      if (error) throw error;

      // Supprimer la campagne localement pour mise à jour instantanée sans rechargement complet
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setStats((prev) => ({
        ...prev,
        activeCampaigns: prev.activeCampaigns - 1 // optionnel : à adapter si nécessaire
      }));

      alert("Campagne supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Impossible de supprimer la campagne. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };



  // Charger toutes les données au montage du composant
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStats(),
          fetchCampaigns(),
          fetchUsers(),
          fetchDetailedDonations()
        ]);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Une erreur est survenue lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (loading && !campaigns.length && !users.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-500 mx-auto mb-4"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-destructive">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }
                            const [open, setOpen] = useState(false);

  // Calculer le taux de conversion (nombre de visiteurs qui ont fait un don)
  // Note: Ceci est une approximation, pour un calcul précis vous auriez besoin de 
  // données d'analytique supplémentaires
  const conversionRate = stats.donorsCount > 0 ? ((stats.donorsCount / users.length) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        {/* <Button onClick={() => navigate('/admin/campaigns/new')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Campagne
        </Button> */}
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
              <span>Mise à jour en temps réel</span>
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
            <p className="text-xs text-muted-foreground">
              Sur {users.length} utilisateurs inscrits
            </p>
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
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <div className="text-xs text-muted-foreground">
              Utilisateurs ayant fait au moins un don
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
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                              {campaign.image_url ? (
                                <img
                                  src={campaign.image_url}
                                  alt={campaign.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Target className="h-6 w-6 m-auto text-muted-foreground" />
                              )}
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
                          {formatDate(campaign.end_date)}
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

                            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                              <Edit className="h-4 w-4" />
                            </Button>

                            {open && <EditCampaign campaignId={campaign.id} onClose={() => setOpen(false)} />}

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              disabled={loading}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Aucune campagne trouvée
                      </td>
                    </tr>
                  )}
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
                  {donations.length > 0 ? (
                    donations.map((donation) => {
                      const user = users.find(u => u.id === donation.user_id);
                      const campaign = campaigns.find(c => c.id === donation.campaign_id);
                      return (
                        <tr key={donation.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4 align-middle">
                            {donation.anonymous ? (
                              <span className="text-muted-foreground">Anonyme</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                                  {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <Users className="h-4 w-4 m-auto" />
                                  )}
                                </div>
                                <span>{user?.name || "Utilisateur inconnu"}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 align-middle">
                            {campaign ?
                              `${campaign.title.substring(0, 30)}${campaign.title.length > 30 ? '...' : ''}` :
                              "Campagne inconnue"
                            }
                          </td>
                          <td className="p-4 align-middle font-medium">
                            {formatCurrency(donation.amount)}
                          </td>
                          <td className="p-4 align-middle">
                            {formatDate(donation.created_at)}
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
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        Aucun don trouvé
                      </td>
                    </tr>
                  )}
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
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                              {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
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
                          {formatDate(user.created_at)}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  )}
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