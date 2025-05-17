
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">MainSolidaire</span>
          </div>
          <p className="text-muted-foreground">
            Transformez votre générosité en impact réel.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-3">Liens rapides</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/campaigns" className="text-muted-foreground hover:text-foreground transition-colors">
                Campagnes
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium mb-3">Informations légales</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Conditions d'utilisation
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                Gestion des cookies
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium mb-3">Newsletter</h3>
          <p className="text-muted-foreground mb-3">
            Inscrivez-vous pour recevoir nos actualités.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Votre email"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex-grow"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              OK
            </button>
          </form>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
        <p>© 2025 MainSolidaire. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
