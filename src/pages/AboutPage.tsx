
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Target, Shield } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-medical-50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
            <span className="block bg-primary rounded-full h-2 w-2 mr-2"></span>
            Notre mission
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto mb-6">
            À propos de MainSolidaire
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Nous transformons l'expérience du don dans le domaine de la santé en intégrant des mécanismes de gamification, d'interactivité, de transparence et d'engagement communautaire.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
              <p className="text-lg text-muted-foreground mb-4">
                MainSolidaire est né d'une vision simple mais puissante : rendre les dons en santé plus accessibles, motivants et traçables.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Face aux défis croissants du financement des soins de santé et des initiatives médicales, nous avons créé une plateforme qui renforce la solidarité et l'impact social dans le secteur médical.
              </p>
              <p className="text-lg text-muted-foreground">
                Notre équipe combine des experts en santé publique, en technologie et en engagement communautaire, tous unis par la vision d'un accès équitable aux soins de santé pour tous.
              </p>
            </div>
            <div className="relative rounded-lg overflow-hidden h-80">
  <img  
  src="/4.png" 
  alt="Notre équipe"
  className="w-[800px] h-[630px] object-cover"
/>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Nos Valeurs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident notre mission et nos actions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-background p-6 rounded-lg border text-center">
              <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Solidarité</h3>
              <p className="text-muted-foreground">
                Nous croyons que la santé est un droit fondamental et que la solidarité est essentielle pour y parvenir.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border text-center">
              <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Transparence</h3>
              <p className="text-muted-foreground">
                Chaque euro donné est tracé, chaque impact est mesuré et partagé avec notre communauté.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border text-center">
              <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Impact</h3>
              <p className="text-muted-foreground">
                Nous nous concentrons sur des initiatives qui génèrent un impact réel et mesurable sur la santé.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border text-center">
              <div className="h-16 w-16 rounded-full bg-medical-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Engagement</h3>
              <p className="text-muted-foreground">
                Nous encourageons l'engagement actif et durable de notre communauté de donateurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Notre Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Depuis notre lancement, nous avons fait une différence significative.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <p className="text-lg">Campagnes financées</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">€2M+</div>
              <p className="text-lg">Fonds collectés</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-lg">Vies impactées</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Notre Équipe</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Les passionnés qui rendent notre mission possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background p-6 rounded-lg border text-center">
              <div className="h-32 w-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://source.unsplash.com/random/300x300/?portrait" 
                  alt="Membre de l'équipe"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">Amir AYA</h3>
              <p className="text-primary mb-2">Fondatrice & Directrice</p>
              <p className="text-muted-foreground text-sm">
                Médecin et entrepreneuse sociale, passionnée par l'accès équitable aux soins de santé.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border text-center">
              <div className="h-32 w-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://source.unsplash.com/random/300x300/?man" 
                  alt="Membre de l'équipe"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">Elouassif IKRAM</h3>
              <p className="text-primary mb-2">Directeur Technique</p>
              <p className="text-muted-foreground text-sm">
                Expert en technologie avec 15 ans d'expérience dans le développement de plateformes sociales.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border text-center">
              <div className="h-32 w-32 rounded-full overflow-hidden mx-auto mb-4">
                <img 
                  src="https://source.unsplash.com/random/300x300/?woman" 
                  alt="Membre de l'équipe"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">Batta AMAR</h3>
              <p className="text-primary mb-2">Directrice des Partenariats</p>
              <p className="text-muted-foreground text-sm">
                Spécialiste des relations avec les organisations de santé et les institutions médicales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Rejoignez notre mission</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Ensemble, nous pouvons transformer l'expérience du don dans le domaine de la santé et créer un impact durable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/campaigns')}
            >
              Soutenir une campagne
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate('/contact')}
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
