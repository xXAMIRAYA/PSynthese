
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import CampaignForm from '@/components/campaigns/CampaignForm';

const CreateCampaignPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/campaigns/create" }} />;
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Créer une nouvelle campagne</h1>
      <CampaignForm />
    </div>
  );
};

export default CreateCampaignPage;
