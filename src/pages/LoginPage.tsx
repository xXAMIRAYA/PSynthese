
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from "lucide-react";

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Heart className="h-12 w-12 text-primary mx-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            Connexion à MainSolidaire
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Accédez à votre espace personnel pour gérer vos dons et suivre leur impact.
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
