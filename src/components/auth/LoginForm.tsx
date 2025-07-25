import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  // Login avec récupération du rôle
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Erreur login:', error.message);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Utilisateur non trouvé après connexion");
    }

    // Petit délai pour s'assurer que l'utilisateur est bien à jour (optionnel)
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Erreur récupération rôle:', profileError.message);
      throw new Error(profileError.message);
    }

    return { ...data.user, role: profile.role };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const user = await login(email, password);
      console.log("User connecté:", user);

      if (user && user.role) {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from);
        }
      } else {
        setMessage("Rôle utilisateur introuvable.");
      }
    } catch (error: any) {
      setMessage(error.message || "Erreur lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Veuillez entrer votre adresse email.");
      return;
    }

    setIsResetting(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      setMessage("Erreur lors de l'envoi de l'email : " + error.message);
    } else {
      setMessage("Un email de réinitialisation a été envoyé.");
    }

    setIsResetting(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-primary">Connexion</CardTitle>
        <CardDescription className="text-center">
          Connectez-vous pour accéder à votre espace personnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votreemail@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>

          <div className="text-sm text-center mt-2">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isResetting}
              className="text-primary hover:underline"
            >
              {isResetting ? "Envoi en cours..." : "Mot de passe oublié ?"}
            </button>
          </div>

          {message && (
            <p className="text-sm text-center text-muted-foreground mt-2">{message}</p>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center text-sm">
        <p>
          <span className="text-muted-foreground">Pas encore de compte ? </span>
          <a href="/register" className="text-primary hover:underline">S'inscrire</a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
