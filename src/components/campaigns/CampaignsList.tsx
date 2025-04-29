
import { useState, useEffect } from 'react';
import { Campaign } from '@/types';
import CampaignCard from './CampaignCard';
import { campaigns as mockCampaigns } from '@/services/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');

  useEffect(() => {
    // In a real application, this would be an API call
    setCampaigns(mockCampaigns);
    setFilteredCampaigns(mockCampaigns);
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
          campaign.location.toLowerCase().includes(query) ||
          campaign.organizer.toLowerCase().includes(query)
      );
    }
    
    setFilteredCampaigns(result);
  }, [currentTab, searchQuery, campaigns]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher une campagne..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="urgent">Urgentes</TabsTrigger>
          <TabsTrigger value="emergency">Urgence</TabsTrigger>
          <TabsTrigger value="research">Recherche</TabsTrigger>
          <TabsTrigger value="equipment">Équipement</TabsTrigger>
          <TabsTrigger value="care">Soins</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filteredCampaigns.length === 0 ? (
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
