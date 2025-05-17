import { Heart, ChevronRight, Target, Award, ArrowRight } from 'lucide-react';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { Input } from "@/components/ui/input";
import { fetchCampaigns } from '@/services/campaignService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from "react";
import { Campaign } from "@/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
        const data = await fetchCampaigns();
        setCampaigns(data);
        setFilteredCampaigns(data);
      } catch (error) {
        console.error("Erreur lors du chargement des campagnes :", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCampaigns(campaigns);
    } else {
      const results = campaigns.filter(campaign =>
        campaign.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCampaigns(results);
    }
  }, [search, campaigns]);

  // Filtrer les campagnes urgentes (exemple : propriété "urgent" à true)
  const urgentCampaigns = filteredCampaigns.filter(campaign => campaign.categorie === "umergency");

  return (
    <div>
      {/* Section Hero */}
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

      {/* Section Campagnes Urgentes */}
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
            xmlns="http://www.w3.org/2000/svg"
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
        <Link to="/campaigns" className="flex items-center">
          Voir toutes
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCampaigns
        .filter(campaign => campaign.categorie === "umergency")
        .slice(0, 3)  // max 3 campagnes
        .map((campaign) => {
          const percentComplete = Math.floor((campaign.currentAmount / campaign.targetAmount) * 100);
          return (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=2600&auto=format&fit=crop";
                  }}
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  URGENT
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{campaign.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{campaign.shortDescription}</p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{campaign.currentAmount.toLocaleString()} €</span>
                    <span className="text-gray-500">Objectif: {campaign.targetAmount.toLocaleString()} €</span>
                  </div>
                  <Progress value={percentComplete} className="h-2 bg-red-100" />
                </div>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white" asChild>
                  <Link to={`/campaigns/${campaign.id}`}>
                    Aider maintenant
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  </div>
</section>


      {/* Section Campagnes à la une */}
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
          <div className="mb-8 max-w-md">
            <Input
              placeholder="Rechercher une campagne..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {isLoading ? (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
    <p>Chargement des campagnes...</p>
  </div>
) : filteredCampaigns.length === 0 ? (
  <p>Aucune campagne ne correspond à votre recherche.</p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredCampaigns.slice(0, 3).map(campaign => (
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
