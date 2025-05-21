import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import DonateForm from './DonateForm';
import { fetchCampaignById } from '@/services/campaignService';
import { fetchDonationsByCampaign } from '@/services/donationService';
import { ArrowLeft, Calendar, MapPin, User as UserIcon, Award, Share2, Clock } from "lucide-react";

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any | null>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDonateForm, setShowDonateForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();



  
  useEffect(() => {
    if (!id) return;
    const loadCampaign = async () => {
      try {
        setIsLoading(true);
        const campaignData = await fetchCampaignById(id);
        const donationsData = await fetchDonationsByCampaign(id);
        setCampaign(campaignData);
        setDonations(donationsData);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la campagne",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadCampaign();
  }, [id, toast]);

  const handleDonate = () => {
    if (user) {
      setShowDonateForm(true);
    } else {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour faire un don",
      });
      navigate('/login', { state: { from: `/campaign/${id}` } });
    }
  };

  const handleDonateSuccess = async () => {
    setShowDonateForm(false);
    const updatedCampaign = await fetchCampaignById(id!);
    const updatedDonations = await fetchDonationsByCampaign(id!);
    setCampaign(updatedCampaign);
    setDonations(updatedDonations);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign?.title,
        text: campaign?.shortDescription,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Lien copié!", description: "Lien copié dans le presse-papier." });
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const progressPercentage = Math.min(Math.round((campaign?.raised / campaign?.target) * 100), 100);

  // const filteredDonations = donations.filter(d =>
  //   d.status === 'validated' || (d.status === 'pending' && d.user_id === user?.id)
    
  // );
  const now = new Date();

const filteredDonations = donations.filter(d => {
  if (d.status === 'validated') {
    return true;
  }
  if (d.status === 'pending' && d.user_id === user?.id) {
    const createdAt = new Date(d.created_at);
    const diffInMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;
    return diffInMinutes <= 1;
  }
  return false;
});


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full mx-auto mb-4" />
          <p>Chargement de la campagne...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Campagne non trouvée</h2>
          <Button onClick={() => navigate('/campaigns')}>Retour aux campagnes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center mt-4">
        <Button variant="ghost" onClick={() => navigate('/campaigns')} className="flex items-center gap-2">
          <ArrowLeft size={16} /> Retour aux campagnes
        </Button>
        <Button variant="outline" onClick={handleShare} className="flex items-center">
          <Share2 className="h-4 w-4 mr-2" /> Partager
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden h-64 md:h-80">
          <img src={campaign.image_url || '/placeholder.svg'} alt={campaign.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge variant={campaign.status === 'urgent' ? 'destructive' : 'default'}>
              {campaign.status === 'urgent' ? 'Urgent' : campaign.status === 'completed' ? 'Complété' : 'Actif'}
            </Badge>
            <Badge>
              {{
                emergency: 'Urgence',
                research: 'Recherche',
                equipment: 'Équipement',
                awareness: 'Sensibilisation',
                care: 'Soins'
              }[campaign.category] || campaign.category}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold">{campaign.title}</h1>
            <div className="text-muted-foreground mt-2 flex items-center gap-2"><MapPin size={16} />{campaign.location}</div>
            <div className="text-muted-foreground mt-1 flex items-center gap-2"><Calendar size={16} />Date limite: {formatDate(campaign.end_date)}</div>
            <div className="text-muted-foreground mt-1 flex items-center gap-2"><UserIcon size={16} />Organisé par {campaign.organizer?.name || 'Inconnu'}</div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{formatCurrency(campaign.raised)}</h3>
                <p className="text-muted-foreground">collectés sur {formatCurrency(campaign.target)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{progressPercentage}% complété</span>
                  <span className="text-muted-foreground">{campaign.donors_count} donateurs</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <Button className="w-full" onClick={handleDonate} disabled={campaign.status === 'completed'}>
                Faire un don
              </Button>
              {showDonateForm && (
                <DonateForm
                  campaignId={campaign.id}
                  onSuccess={handleDonateSuccess}
                  onCancel={() => setShowDonateForm(false)}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            {/* <TabsTrigger value="updates">Mises à jour {campaign.updates?.length ? `(${campaign.updates.length})` : ''}</TabsTrigger> */}
            <TabsTrigger value="donors">Donateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none whitespace-pre-line">
              <p>{campaign.description}</p>
              <h3 className="text-xl font-semibold mt-6">Impact</h3>
              <p>Votre don permettra de soutenir directement cette initiative cruciale. Chaque contribution compte et nous vous remercions pour votre soutien à cette cause importante.</p>
            </div>
          </TabsContent>

          <TabsContent value="updates" className="mt-6">
            {campaign.updates?.length > 0 ? (
              <div className="space-y-4">
                {campaign.updates.map((update: any) => (
                  <Card key={update.id}>
                    <CardContent className="p-4 space-y-2">
                      <p className="text-sm text-muted-foreground">{formatDate(update.created_at)}</p>
                      <p>{update.content}</p>
                      {update.image_url && (
                        <img src={update.image_url} alt="Update" className="rounded-md w-full h-48 object-cover mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">Aucune mise à jour pour le moment.</p>
            )}
          </TabsContent>

         <TabsContent value="donors" className="mt-6">
  {filteredDonations.length > 0 ? (
    <div className="space-y-4">
      {filteredDonations
        .filter((donation: any) => {
          if (donation.status !== 'pending') return true;
          const now = new Date();
          const createdAt = new Date(donation.created_at);
          const diffInMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;
          return diffInMinutes <= 5;
        })
        .map((donation: any) => (
          <Card key={donation.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {donation.anonymous ? "Donateur anonyme" : donation.donor?.name || 'Inconnu'}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(donation.created_at)}</p>
                  {donation.status === 'pending' && (
                    <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" /> En attente de validation
                    </p>
                  )}
                  {donation.message && (
                    <p className="mt-2 italic">{donation.message}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(donation.amount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <Award className="h-12 w-12 mx-auto text-primary mb-4" />
      <h3 className="text-xl font-semibold">Soyez le premier à donner !</h3>
      <p className="text-muted-foreground mt-2">Votre soutien est essentiel pour atteindre nos objectifs.</p>
    </div>
  )}
</TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default CampaignDetail;
