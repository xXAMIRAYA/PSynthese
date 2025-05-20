
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/components/ui/use-toast';
// import { makeDonation } from '@/services/donationService';

// interface DonateFormProps {
//   campaignId: string;
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// const DonateForm = ({ campaignId, onSuccess, onCancel }: DonateFormProps) => {
//   const [amount, setAmount] = useState<number>(50);
//   const [message, setMessage] = useState<string>('');
//   const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const { user } = useAuth();
//   const { toast } = useToast();

//   const predefinedAmounts = [10, 25, 50, 100, 200];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!user) {
//       toast({
//         title: "Erreur",
//         description: "Vous devez être connecté pour faire un don",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     if (!amount || amount <= 0) {
//       toast({
//         title: "Montant invalide",
//         description: "Veuillez entrer un montant valide",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       await makeDonation(campaignId, user.id, {
//         amount,
//         message: message.trim() || undefined,
//         anonymous: isAnonymous
//       });
      
//       toast({
//         title: "Merci pour votre don!",
//         description: `Vous avez donné ${amount}€ à cette campagne.`,
//       });
//       onSuccess();
//     } catch (error) {
//       console.error('Error donating:', error);
//       toast({
//         title: "Erreur",
//         description: "Une erreur est survenue lors du traitement de votre don",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="mt-4 border-t pt-4">
//       <h3 className="font-medium mb-4">Faire un don</h3>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label>Choisissez un montant (€)</Label>
//           <div className="grid grid-cols-5 gap-2 my-2">
//             {predefinedAmounts.map((predefinedAmount) => (
//               <Button
//                 key={predefinedAmount}
//                 type="button"
//                 variant={amount === predefinedAmount ? "default" : "outline"}
//                 className="h-10"
//                 onClick={() => setAmount(predefinedAmount)}
//               >
//                 {predefinedAmount}€
//               </Button>
//             ))}
//           </div>
//           <div className="mt-2">
//             <Input
//               type="number"
//               value={amount || ''}
//               onChange={(e) => setAmount(Number(e.target.value))}
//               placeholder="Autre montant"
//               min={1}
//               className="w-full"
//             />
//           </div>
//         </div>
        
//         <div>
//           <Label htmlFor="message">Message (optionnel)</Label>
//           <Textarea
//             id="message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Votre message de soutien"
//             className="resize-none"
//           />
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="anonymous"
//             checked={isAnonymous}
//             onCheckedChange={setIsAnonymous}
//           />
//           <Label htmlFor="anonymous">Faire un don anonyme</Label>
//         </div>
        
//         <div className="flex gap-3">
//           <Button type="submit" className="w-full" disabled={isSubmitting}>
//             {isSubmitting ? "Traitement..." : "Confirmer le don"}
//           </Button>
//           <Button type="button" variant="outline" onClick={onCancel}>
//             Annuler
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DonateForm;
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { makeDonation } from '@/services/donationService';

interface DonateFormProps {
  campaignId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const DonateForm = ({ campaignId, onSuccess, onCancel }: DonateFormProps) => {
  const [donationType, setDonationType] = useState<'money' | 'material' | 'volunteering'>('money');
  const [amount, setAmount] = useState<number>(50);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const predefinedAmounts = [10, 25, 50, 100, 200];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return toast({
        title: "Erreur",
        description: "Vous devez être connecté pour faire un don",
        variant: "destructive",
      });
    }

    const data: any = { type: donationType, message: message.trim() || undefined, anonymous: isAnonymous };

    if (donationType === 'money') {
      if (!amount || amount <= 0) {
        return toast({
          title: "Montant invalide",
          description: "Veuillez entrer un montant valide",
          variant: "destructive",
        });
      }
      data.amount = amount;
    }

    if (donationType === 'material') {
      if (!description.trim() || quantity <= 0) {
        return toast({
          title: "Données invalides",
          description: "Veuillez fournir une description et une quantité valide",
          variant: "destructive",
        });
      }
      data.description = description.trim();
      data.quantity = quantity;
    }

    if (donationType === 'volunteering') {
      if (!skills.trim() || !availability.trim()) {
        return toast({
          title: "Informations incomplètes",
          description: "Veuillez fournir vos compétences et disponibilités",
          variant: "destructive",
        });
      }
      data.skills = skills.trim();
      data.availability = availability.trim();
    }

    setIsSubmitting(true);
    try {
      await makeDonation(campaignId, user.id, data);
      toast({
        title: "Merci !",
        description: `Votre don (${donationType}) a bien été enregistré.`,
      });
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du don",
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
          <Label htmlFor="type">Type de don</Label>
          <Select value={donationType} onValueChange={(value) => setDonationType(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Choisissez un type de don" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="money">Argent</SelectItem>
              <SelectItem value="material">Matériel</SelectItem>
              <SelectItem value="volunteering">Bénévolat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {donationType === 'money' && (
          <>
            <Label>Montant (€)</Label>
            <div className="grid grid-cols-5 gap-2 my-2">
              {predefinedAmounts.map((predefinedAmount) => (
                <Button
                  key={predefinedAmount}
                  type="button"
                  variant={amount === predefinedAmount ? "default" : "outline"}
                  onClick={() => setAmount(predefinedAmount)}
                >
                  {predefinedAmount}€
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
              placeholder="Autre montant"
            />
          </>
        )}

        {donationType === 'material' && (
          <>
            <Label>Description du matériel</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: vêtements, meubles, nourriture..."
            />
            <Label>Quantité</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </>
        )}

        {donationType === 'volunteering' && (
          <>
            <Label>Compétences</Label>
            <Input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Ex: enseignement, logistique, informatique..."
            />
            <Label>Disponibilité</Label>
            <Input
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Ex: week-end, soirées..."
            />
          </>
        )}

        <Label>Message (optionnel)</Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message de soutien"
        />

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
