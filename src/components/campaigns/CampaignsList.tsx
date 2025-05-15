
import { useState, useEffect } from 'react';
import CampaignCard from './CampaignCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fetchCampaigns } from '@/services/campaignService';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
        setFilteredCampaigns(data);
      } catch (error) {
        console.error('Error loading campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCampaigns();
  }, []);

  useEffect(() => {
    let result = campaigns;
    
    // Filter by tab category
    if (currentTab !== 'all') {
      if (currentTab === 'urgent') {
        result = result.filter(campaign => campaign.status === 'urgent');
      } else {
        result = result.filter(campaign => campaign.category === currentTab);
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        campaign =>
          campaign.title.toLowerCase().includes(query) ||
          campaign.description.toLowerCase().includes(query) ||
          campaign.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredCampaigns(result);
  }, [currentTab, searchQuery, campaigns]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une campagne..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {user && (
          <Button onClick={() => navigate('/campaigns/create')} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Créer une campagne
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="urgent">Sensibilitation</TabsTrigger>
          <TabsTrigger value="emergency">Urgence</TabsTrigger>
          <TabsTrigger value="research">Recherche</TabsTrigger>
          <TabsTrigger value="equipment">Équipement</TabsTrigger>
          <TabsTrigger value="care">Soins</TabsTrigger>
        </TabsList>
      </Tabs>
      
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
          {filteredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignsList;
