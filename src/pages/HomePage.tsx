
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronRight, Target, Award, Users } from 'lucide-react';
import { campaigns as mockCampaigns } from '@/services/mockData';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { Campaign } from '@/types';

const HomePage = () => {
  const navigate = useNavigate();
  
  // Adapter les campaigns mock data pour qu'ils soient conformes au type attendu par CampaignCard
  const featuredCampaigns = mockCampaigns.slice(0, 3).map(campaign => ({
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    category: campaign.category as 'emergency' | 'research' | 'equipment' | 'care' | 'awareness',
    location: campaign.location,
    organizer: {
      name: typeof campaign.organizer === 'string' ? campaign.organizer : campaign.organizer,
      avatar_url: typeof campaign.organizer === 'string' ? undefined : campaign.organizer
    },
    target: campaign.target,
    raised: campaign.raised,
    donors_count: campaign.donorsCount || campaign.donors_count || 0,
    image_url: campaign.imageUrl || campaign.image_url || '',
    end_date: campaign.endDate || campaign.end_date || '',
    created_at: campaign.createdAt || campaign.created_at || '',
    status: campaign.status as 'active' | 'completed' | 'urgent'
  }));

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-medical-50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in">
            <span className="block bg-primary rounded-full h-2 w-2 mr-2"></span>
            Ensemble pour une santé accessible à tous
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mb-6 animate-fade-in">
            Transformez votre générosité en <span className="text-primary">impact médical concret</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 animate-fade-in">
            Health Solidarity Hub met en relation les donateurs et les structures médicales pour transformer l'expérience du don dans le domaine de la santé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in">
            <Button size="lg" onClick={() => navigate('/campaigns')}>
              Découvrir les campagnes
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/about')}>
              En savoir plus
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl">
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Campagnes actives</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">200K+</div>
              <div className="text-sm text-muted-foreground">Fonds collectés</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Donateurs</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Transparence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Campagnes à la une</h2>
              <p className="text-muted-foreground">Découvrez les initiatives qui ont besoin de votre soutien.</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/campaigns')}
              className="mt-4 md:mt-0"
            >
              Voir toutes les campagnes
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Comment ça marche</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Health Solidarity Hub rend le processus de don transparent, engageant et efficace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">1. Explorez les campagnes</h3>
              <p className="text-muted-foreground">
                Parcourez les différentes initiatives médicales et choisissez celle qui vous tient à cœur.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">2. Faites un don</h3>
              <p className="text-muted-foreground">
                Contribuez au montant de votre choix en toute sécurité et transparence.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">3. Suivez l'impact</h3>
              <p className="text-muted-foreground">
                Visualisez l'évolution de la campagne et recevez des mises à jour sur l'utilisation des fonds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Témoignages</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ce que disent nos utilisateurs à propos de Health Solidarity Hub.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border rounded-lg p-6">
              <p className="italic mb-4">
                "Grâce à Health Solidarity Hub, j'ai pu suivre l'impact concret de mes dons pour l'hôpital de ma ville. La transparence et les mises à jour régulières m'ont vraiment rassuré."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-medical-100 flex items-center justify-center mr-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Jean Dupont</div>
                  <div className="text-sm text-muted-foreground">Donateur régulier</div>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <p className="italic mb-4">
                "En tant que responsable d'un projet de recherche, cette plateforme nous a permis de collecter les fonds nécessaires tout en maintenant un lien de confiance avec nos donateurs."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-medical-100 flex items-center justify-center mr-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Dr. Marie Laurent</div>
                  <div className="text-sm text-muted-foreground">Chercheuse en oncologie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à faire la différence?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Rejoignez notre communauté et contribuez à améliorer l'accès aux soins de santé pour ceux qui en ont besoin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/campaigns')}
            >
              Explorer les campagnes
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate('/register')}
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
