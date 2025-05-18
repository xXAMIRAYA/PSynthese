import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Input } from '../ui/input';

const ChatDemoInteractive = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
      }
    };
    
    checkUser();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    
    try {
      if (isLoginForm) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        setUser(data.user);
        setIsLoggedIn(true);
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            }
          }
        });
        
        if (error) throw error;
        alert("Compte créé avec succès! Veuillez vérifier votre email pour confirmer votre inscription.");
        setIsLoginForm(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLoggedIn ? 'Bienvenue!' : (isLoginForm ? 'Connexion' : 'Inscription')}
        </h1>
        
        {isLoggedIn ? (
          <div className="text-center">
            <p className="mb-4">Vous êtes connecté en tant que: <strong>{user.email}</strong></p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Se déconnecter
            </button>
            <p className="mt-8 text-gray-600">
              Une fois connecté, vous pouvez utiliser la fonctionnalité de chat en cliquant sur l'icône 
              de messagerie dans le coin inférieur droit de l'écran.
            </p>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLoginForm && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required={!isLoginForm}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {isLoginForm ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </form>
        )}
        
        {!isLoggedIn && (
          <p className="mt-4 text-center text-sm">
            {isLoginForm ? 'Pas encore de compte?' : 'Déjà un compte?'}{' '}
            <button
              type="button"
              onClick={() => setIsLoginForm(!isLoginForm)}
              className="text-blue-500 hover:underline"
            >
              {isLoginForm ? 'S\'inscrire' : 'Se connecter'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatDemoInteractive;