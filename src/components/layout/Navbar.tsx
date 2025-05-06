
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Heart, 
  User, 
  LogOut, 
  Bell, 
  Menu, 
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Obtenir l'initiale du nom d'utilisateur pour le fallback de l'avatar
  const getInitial = (name: string | null | undefined) => {
    return name && name.length > 0 ? name.charAt(0) : '?';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="hidden font-bold text-xl sm:inline-block">Health Solidarity</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/campaigns"
              className={`text-sm font-medium transition-colors ${
                isActive('/campaigns') ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Campagnes
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              À propos
            </Link>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                  2
                </span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.name || 'User'} />
                      <AvatarFallback>{getInitial(profile?.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{profile?.name}</p>
                      <p className="text-xs text-muted-foreground">{profile?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Mon profil
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <span className="mr-2">🛡️</span>
                      Administration
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Se connecter
              </Button>
              <Button onClick={() => navigate('/register')}>
                S'inscrire
              </Button>
            </>
          )}
        </div>
        
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/campaigns"
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-medium transition-colors ${
                isActive('/campaigns') ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Campagnes
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-primary' : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              À propos
            </Link>
          </div>
          
          <div className="border-t pt-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.name || 'User'} />
                    <AvatarFallback>{getInitial(profile?.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{profile?.name}</p>
                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Mon profil
                </Button>
                {isAdmin() && (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                  >
                    <span className="mr-2">🛡️</span>
                    Administration
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                >
                  Se connecter
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => { navigate('/register'); setIsMenuOpen(false); }}
                >
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
