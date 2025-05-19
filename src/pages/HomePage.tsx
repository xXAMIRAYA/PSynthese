import { ChevronRight, ArrowRight } from 'lucide-react';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { fetchCampaigns } from '@/services/campaignService';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Campaign } from '@/types';
import { Progress } from '@/components/ui/progress';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data: Campaign[] = await fetchCampaigns();
        const mapped = data.map((c) => ({
          ...c,
          image_url: c.image_url ?? '',
        }));
        setCampaigns(mapped);
        setFilteredCampaigns(mapped);
      } catch (error) {
        console.error('Erreur lors du chargement des campagnes :', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  useEffect(() => {
    const results = campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCampaigns(results);
  }, [search, campaigns]);

  const urgentCampaigns = campaigns.filter(
    (c) => c.category?.toLowerCase() === 'emergency'
  );

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
            MainSolidaire met en relation les donateurs et les structures médicales pour transformer l'expérience du don dans le domaine de la santé.
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
            {[
              { value: '5+', label: 'Campagnes actives' },
              { value: '200K+', label: 'Fonds collectés' },
              { value: '1000+', label: 'Donateurs' },
              { value: '100%', label: 'Transparence' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{item.value}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Campaigns Section */}
      <section className="py-10 bg-red-50">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <div className="mr-3 p-2 bg-red-100 rounded-full">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        Campagnes Urgentes
      </h2>
      <Button variant="outline" size="sm" asChild>
        <Link to="/campaigns?tab=emergency" className="flex items-center">
          Voir toutes
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCampaigns
        .filter((campaign) => campaign.category === "emergency")
        .slice(0, 3)
        .map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
    </div>
  </div>
</section>
      {/* Featured Campaigns Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Campagnes à la une</h2>
              <p className="text-muted-foreground">Découvrez les initiatives qui ont besoin de votre soutien.</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/campaigns')} className="mt-4 md:mt-0">
              Voir toutes les campagnes
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mb-8 max-w-md">
            <Input placeholder="Rechercher une campagne..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Chargement des campagnes...</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Aucune campagne trouvée</h3>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.slice(0, 3).map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
