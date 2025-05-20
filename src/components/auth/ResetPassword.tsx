import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifie que l'utilisateur est bien connecté après redirection
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setMessage("Lien expiré ou invalide. Veuillez recommencer.");
      }
    };

    checkUser();
  }, []);

  const handleReset = async () => {
    setIsSubmitting(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setMessage("Mot de passe mis à jour ! Redirection vers le tableau de bord...");
      setTimeout(() => navigate('/dashboard'), 2000); // Redirection vers /dashboard
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-center text-xl">Nouveau mot de passe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label htmlFor="password">Entrez un nouveau mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleReset} disabled={isSubmitting || !password} className="w-full">
          {isSubmitting ? "Mise à jour..." : "Réinitialiser"}
        </Button>
        {message && <p className="text-sm text-center text-muted-foreground">{message}</p>}
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
