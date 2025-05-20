
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
  const [amount, setAmount] = useState<number>(50);
  const [message, setMessage] = useState<string>('');
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
    
    if (!amount || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await makeDonation(campaignId, user.id, {
        amount,
        message: message.trim() || undefined,
        anonymous: isAnonymous
      });
      
      toast({
        title: "Merci pour votre don!",
        description: `Vous avez donné ${amount}€ à cette campagne.`,
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
      <form onSubmit={handleSubmit} className="space-y-4">
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
        
        <div>
          <Label htmlFor="message">Message (optionnel)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Votre message de soutien"
            className="resize-none"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="anonymous"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
          <Label htmlFor="anonymous">Faire un don anonyme</Label>
        </div>
        
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