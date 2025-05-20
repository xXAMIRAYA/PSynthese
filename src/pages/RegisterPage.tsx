
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from '@/components/ui/use-toast';
// import { Link, useNavigate } from 'react-router-dom';
// import { Heart } from "lucide-react";
// import { useAuth } from '@/contexts/AuthContext';

// const RegisterPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [passwordConfirm, setPasswordConfirm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const { register } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     // Validation
//     if (password !== passwordConfirm) {
//       toast({
//         title: "Erreur",
//         description: "Les mots de passe ne correspondent pas",
//         variant: "destructive",
//       });
//       setIsLoading(false);
//       return;
//     }
    
//     if (password.length < 6) {
//       toast({
//         title: "Erreur",
//         description: "Le mot de passe doit comporter au moins 6 caractères",
//         variant: "destructive",
//       });
//       setIsLoading(false);
//       return;
//     }
    
//     try {
//       const success = await register(email, password, name);
      
//       if (success) {
//         toast({
//           title: "Compte créé avec succès",
//           description: "Vous pouvez maintenant vous connecter avec vos identifiants",
//         });
//         navigate('/login');
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       toast({
//         title: "Erreur",
//         description: "Une erreur est survenue lors de la création du compte",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
//       <div className="w-full max-w-md space-y-8">
//         <div className="text-center">
//           <Heart className="h-12 w-12 text-primary mx-auto" />
//           <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
//             Créer un compte
//           </h2>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Rejoignez Health Solidarity pour participer à l'amélioration de la santé pour tous.
//           </p>
//         </div>
        
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-2xl text-center">Inscription</CardTitle>
//             <CardDescription className="text-center">
//               Complétez le formulaire ci-dessous pour créer votre compte
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Nom complet</Label>
//                 <Input
//                   id="name"
//                   placeholder="Votre nom et prénom"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="votreemail@exemple.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Mot de passe</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   minLength={6}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="passwordConfirm">Confirmer le mot de passe</Label>
//                 <Input
//                   id="passwordConfirm"
//                   type="password"
//                   value={passwordConfirm}
//                   onChange={(e) => setPasswordConfirm(e.target.value)}
//                   required
//                 />
//               </div>
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Création en cours..." : "S'inscrire"}
//               </Button>
//             </form>
//           </CardContent>
//           <CardFooter>
//             <p className="text-center text-sm w-full">
//               <span className="text-muted-foreground">Déjà un compte? </span>
//               <Link to="/login" className="text-primary hover:underline">
//                 Se connecter
//               </Link>
//             </p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [role, setRole] = useState("donator");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminCodeError, setShowAdminCodeError] = useState(false);
  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  // Code d'administration (normalement il serait stocké de façon sécurisée)
  const ADMIN_SECRET_CODE = "ADMIN1234"; // À remplacer par votre code sécurisé

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit comporter au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    // Vérification du code admin si le rôle est "admin"
    if (role === "admin" && adminCode !== ADMIN_SECRET_CODE) {
      setShowAdminCodeError(true);
      toast({
        title: "Erreur",
        description: "Code administrateur invalide",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Envoyer le rôle avec les informations d'inscription
      const success = await register(email, password, name, role);
      if (success) {
        toast({
          title: "Compte créé avec succès",
          description: `Vous êtes inscrit en tant que ${
            role === "admin" 
              ? "administrateur" 
              : role === "campaign_manager" 
                ? "responsable de campagne" 
                : "donateur"
          }`,
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du compte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Heart className="h-12 w-12 text-primary mx-auto" />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Inscription</CardTitle>
            <CardDescription className="text-center">
              Complétez le formulaire ci-dessous pour créer votre compte
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Tabs defaultValue="donator" onValueChange={(value) => {
                setRole(value);
                setShowAdminCodeError(false);
              }}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="donator">Donateur</TabsTrigger>
                  <TabsTrigger value="campaign_manager">Responsable</TabsTrigger>
                  {/* <TabsTrigger value="admin">Admin</TabsTrigger> */}
                </TabsList>

                <TabsContent value="donator">
                  <p className="text-sm text-gray-600 mb-4">
                    En tant que donateur, vous pourrez soutenir des campagnes, suivre vos dons et recevoir
                    des mises à jour sur les causes que vous soutenez.
                  </p>
                </TabsContent>

                <TabsContent value="campaign_manager">
                  <p className="text-sm text-gray-600 mb-4">
                    En tant que responsable de campagne, vous pourrez créer et gérer des campagnes de collecte
                    de fonds pour votre organisation médicale ou votre projet de santé.
                  </p>
                </TabsContent>

                <TabsContent value="admin">
                  <p className="text-sm text-gray-600 mb-4">
                    En tant qu'administrateur, vous aurez accès à toutes les fonctionnalités de la plateforme,
                    y compris la gestion des utilisateurs, l'approbation des campagnes et les statistiques globales.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="admin-code">Code administrateur</Label>
                    <Input
                      id="admin-code"
                      type="password"
                      placeholder="Code d'accès administrateur"
                      value={adminCode}
                      onChange={(e) => {
                        setAdminCode(e.target.value);
                        setShowAdminCodeError(false);
                      }}
                    />
                    {showAdminCodeError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Code administrateur incorrect. Veuillez contacter le support pour obtenir un code valide.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Inscription en cours..." : "Créer un compte"}
              </Button>
              <div className="mt-4 text-center text-sm">
                <span className="text-gray-600">Vous avez déjà un compte?</span>{" "}
                <Link to="/login" className="text-medical-blue hover:text-medical-green font-medium">
                  Connectez-vous
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;