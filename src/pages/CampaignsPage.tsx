
import CampaignsList from '@/components/campaigns/CampaignsList';

const CampaignsPage = () => {
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Campagnes</h1>
        <p className="text-muted-foreground">
          Découvrez les initiatives qui ont besoin de votre soutien et faites un don pour contribuer à un avenir meilleur.
        </p>
      </div>
      
      <CampaignsList />
    </div>
  );
};

export default CampaignsPage;
