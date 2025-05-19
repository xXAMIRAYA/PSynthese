import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { makeDonation } from '@/services/donationService';



interface DonateFormProps {
  campaignId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const DonateForm = ({ campaignId, onSuccess, onCancel }: DonateFormProps) => {
  const [donationKind, setDonationKind] = useState<'argent' | 'materiel'>('argent');
  const [amount, setAmount] = useState<number>(50);
  const [materialName, setMaterialName] = useState('');
  const [message, setMessage] = useState<string>('');
  const [images, setImages] = useState<FileList | null>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const predefinedAmounts = [10, 25, 50, 100, 200];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour faire un don",
        variant: "destructive",
      });
      return;
    }

    if (donationKind === 'argent') {
      if (!amount || amount <= 0) {
        toast({
          title: "Montant invalide",
          description: "Veuillez entrer un montant valide",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!materialName.trim()) {
        toast({
          title: "Nom du matériel manquant",
          description: "Veuillez renseigner le nom du matériel",
          variant: "destructive",
        });
        return;
      }

      if (!images || images.length === 0) {
        toast({
          title: "Aucune photo sélectionnée",
          description: "Veuillez ajouter au moins une photo du matériel",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('kind', donationKind);
      formData.append('anonymous', String(isAnonymous));
      formData.append('campaignId', campaignId);
      formData.append('userId', user.id);

      if (donationKind === 'argent') {
        formData.append('amount', String(amount));
        if (message.trim()) formData.append('message', message.trim());
      } else {
        formData.append('materialName', materialName.trim());
        if (message.trim()) formData.append('message', message.trim());
        if (images) {
          Array.from(images).forEach((image) => {
            formData.append('images', image);
          });
        }
      }

      await makeDonation(formData); // Il faut que `makeDonation` accepte un FormData côté backend

      toast({
        title: "Merci pour votre don!",
        description:
          donationKind === 'argent'
            ? `Vous avez donné ${amount}€ à cette campagne.`
            : `Votre don matériel a été enregistré.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error donating:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de votre don",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-medium mb-4">Faire un don</h3>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

        {/* Type de don */}
        <div>
          <Label>Type de don</Label>
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant={donationKind === 'argent' ? 'default' : 'outline'}
              onClick={() => setDonationKind('argent')}
            >
              Argent
            </Button>
            <Button
              type="button"
              variant={donationKind === 'materiel' ? 'default' : 'outline'}
              onClick={() => setDonationKind('materiel')}
            >
              Matériel
            </Button>
          </div>
        </div>

        {/* Champs conditionnels */}
        {donationKind === 'argent' ? (
          <div>
            <Label>Choisissez un montant (€)</Label>
            <div className="grid grid-cols-5 gap-2 my-2">
              {predefinedAmounts.map((predefinedAmount) => (
                <Button
                  key={predefinedAmount}
                  type="button"
                  variant={amount === predefinedAmount ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setAmount(predefinedAmount)}
                >
                  {predefinedAmount}€
                </Button>
              ))}
            </div>
            <div className="mt-2">
              <Input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Autre montant"
                min={1}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="materialName">Nom du matériel</Label>
              <Input
                id="materialName"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                placeholder="Ex: Tentes, médicaments, couvertures..."
              />
            </div>

            <div>
              <Label htmlFor="images">Photo(s) du matériel</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(e.target.files)}
              />
            </div>
          </>
        )}

        {/* Message */}
        <div>
          <Label htmlFor="message">Message (optionnel)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              donationKind === 'argent'
                ? "Votre message de soutien"
                : "Informations complémentaires sur le matériel"
            }
            className="resize-none"
          />
        </div>

        {/* Anonyme */}
        <div className="flex items-center space-x-2">
          <Switch
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
          <Label htmlFor="anonymous">Faire un don anonyme</Label>
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Traitement..." : "Confirmer le don"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DonateForm;
