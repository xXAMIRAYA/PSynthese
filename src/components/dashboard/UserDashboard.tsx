
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { getUserCampaigns } from '@/services/profileService';
import { fetchUserDonations, getDonationStats } from '@/services/donationService';
import { useFormattingUtils } from '@/hooks/useFormattingUtils';

// Import the new components
import UserHeader from './UserHeader';
import UserStats from './UserStats';
import UserCampaignsTable from './UserCampaignsTable';
import UserDonationsTable from './UserDonationsTable';

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const [userCampaigns, setUserCampaigns] = useState<any[]>([]);
  const [userDonations, setUserDonations] = useState<any[]>([]);
  const [donationStats, setDonationStats] = useState({ count: 0, totalAmount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { formatCurrency, formatDate } = useFormattingUtils();
  
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
      <UserHeader 
        name={profile?.name} 
        email={profile?.email} 
      />
      
      <UserStats 
        totalDonated={donationStats.totalAmount}
        donationsCount={donationStats.count}
        campaignsCount={userCampaigns.length}
        createdAt={profile?.created_at}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
      
      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Mes Campagnes</TabsTrigger>
          <TabsTrigger value="donations">Mes Dons</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-6">
          <UserCampaignsTable 
            campaigns={userCampaigns}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
        
        <TabsContent value="donations" className="mt-6">
          <UserDonationsTable 
            donations={userDonations}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
