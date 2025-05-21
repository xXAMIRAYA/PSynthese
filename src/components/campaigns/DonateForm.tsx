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
//   const [donationKind, setDonationKind] = useState<'argent' | 'materiel'>('argent');
//   const [amount, setAmount] = useState<number>(50);
//   const [materialName, setMaterialName] = useState('');
//   const [message, setMessage] = useState<string>('');
//   const [images, setImages] = useState<FileList | null>(null);
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

//     if (donationKind === 'argent') {
//       if (!amount || amount <= 0) {
//         toast({
//           title: "Montant invalide",
//           description: "Veuillez entrer un montant valide",
//           variant: "destructive",
//         });
//         return;
//       }
//     } else {
//       if (!materialName.trim()) {
//         toast({
//           title: "Nom du matériel manquant",
//           description: "Veuillez renseigner le nom du matériel",
//           variant: "destructive",
//         });
//         return;
//       }

//       if (!images || images.length === 0) {
//         toast({
//           title: "Aucune photo sélectionnée",
//           description: "Veuillez ajouter au moins une photo du matériel",
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       formData.append('kind', donationKind);
//       formData.append('anonymous', String(isAnonymous));
//       formData.append('campaignId', campaignId);
//       formData.append('userId', user.id);

//       if (donationKind === 'argent') {
//         formData.append('amount', String(amount));
//         if (message.trim()) formData.append('message', message.trim());
//       } else {
//         formData.append('materialName', materialName.trim());
//         if (message.trim()) formData.append('message', message.trim());
//         if (images) {
//           Array.from(images).forEach((image) => {
//             formData.append('images', image);
//           });
//         }
//       }

//       await makeDonation(formData); // Il faut que `makeDonation` accepte un FormData côté backend

//       toast({
//         title: "Merci pour votre don!",
//         description:
//           donationKind === 'argent'
//             ? `Vous avez donné ${amount}€ à cette campagne.`
//             : `Votre don matériel a été enregistré.`,
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
//       <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

//         {/* Type de don */}
//         <div>
//           <Label>Type de don</Label>
//           <div className="flex gap-3 mt-2">
//             <Button
//               type="button"
//               variant={donationKind === 'argent' ? 'default' : 'outline'}
//               onClick={() => setDonationKind('argent')}
//             >
//               Argent
//             </Button>
//             <Button
//               type="button"
//               variant={donationKind === 'materiel' ? 'default' : 'outline'}
//               onClick={() => setDonationKind('materiel')}
//             >
//               Matériel
//             </Button>
//           </div>
//         </div>

//         {/* Champs conditionnels */}
//         {donationKind === 'argent' ? (
//           <div>
//             <Label>Choisissez un montant (DH)</Label>
//             <div className="flex flex-wrap gap-2 my-2">
//               {predefinedAmounts.map((predefinedAmount) => (
//                 <Button
//                   key={predefinedAmount}
//                   type="button"
//                   variant={amount === predefinedAmount ? "default" : "outline"}
//                   className="h-10 min-w-[70px] flex-1 text-sm"
//                   onClick={() => setAmount(predefinedAmount)}
//                 >
//                   {predefinedAmount}DH
//                 </Button>
//               ))}
//             </div>
//             <div className="mt-2">
//               <Input
//                 type="number"
//                 value={amount || ''}
//                 onChange={(e) => setAmount(Number(e.target.value))}
//                 placeholder="Autre montant"
//                 min={1}
//                 className="w-full"
//               />
//             </div>
//           </div>
//         ) : (
//           <>
//             <div>
//               <Label htmlFor="materialName">Nom du matériel</Label>
//               <Input
//                 id="materialName"
//                 value={materialName}
//                 onChange={(e) => setMaterialName(e.target.value)}
//                 placeholder="Ex: Tentes, médicaments, couvertures..."
//               />
//             </div>

//             <div>
//               <Label htmlFor="images">Photo(s) du matériel</Label>
//               <Input
//                 id="images"
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={(e) => setImages(e.target.files)}
//               />
//             </div>
//           </>
//         )}

//         {/* Message */}
//         <div>
//           <Label htmlFor="message">Message (optionnel)</Label>
//           <Textarea
//             id="message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder={
//               donationKind === 'argent'
//                 ? "Votre message de soutien"
//                 : "Informations complémentaires sur le matériel"
//             }
//             className="resize-none"
//           />
//         </div>

//         {/* Anonyme */}
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="anonymous"
//             checked={isAnonymous}
//             onCheckedChange={setIsAnonymous}
//           />
//           <Label htmlFor="anonymous">Faire un don anonyme</Label>
//         </div>

//         {/* Boutons */}
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
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { makeDonation , } from '@/services/donationService';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { HandCoins, Box, HeartHandshake } from 'lucide-react';

interface DonateFormProps {
  campaignId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const DonateForm = ({ campaignId, onSuccess, onCancel }: DonateFormProps) => {
  const [donationType, setDonationType] = useState<'argent' | 'materiel' | 'benevolat'>('argent');
  const [amount, setAmount] = useState<number>(50);
  const [materialName, setMaterialName] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [availability, setAvailability] = useState('');
  const [skills, setSkills] = useState('');
  const [message, setMessage] = useState<string>('');
  const [images, setImages] = useState<FileList | null>(null);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const predefinedAmounts = [50, 100, 200, 500, 1000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour contribuer",
        variant: "destructive",
      });
      return;
    }

    // Validation selon le type
    if (donationType === 'argent' && (!amount || amount <= 0)) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide",
        variant: "destructive",
      });
      return;
    }

    if (donationType === 'materiel' && !materialName.trim()) {
      toast({
        title: "Information manquante",
        description: "Veuillez renseigner le nom du matériel",
        variant: "destructive",
      });
      return;
    }

    if (donationType === 'benevolat' && !availability.trim()) {
      toast({
        title: "Information manquante",
        description: "Veuillez renseigner votre disponibilité",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('type', donationType);
      formData.append('campaignId', campaignId);
      formData.append('userId', user.id);

      if (donationType === 'argent') {
        formData.append('amount', amount.toString());
        formData.append('anonymous', isAnonymous.toString());
      } 
      else if (donationType === 'materiel') {
        formData.append('materialName', materialName.trim());
        formData.append('quantity', quantity.toString());
        formData.append('anonymous', isAnonymous.toString());
        if (materialDescription) formData.append('description', materialDescription);
        if (images) {
          Array.from(images).forEach((img, i) => 
            formData.append(`image_${i}`, img)
          );
        }
      } 
      else if (donationType === 'benevolat') {
        formData.append('availability', availability.trim());
        if (skills) formData.append('skills', skills.trim());
      }

      if (message) formData.append('message', message.trim());

      await makeDonation(formData);

      toast({
        title: "Merci pour votre générosité !",
        description: 
          donationType === 'argent' ? `Votre don de ${amount} DH a été enregistré` :
          donationType === 'materiel' ? `Votre don matériel a été enregistré` :
          `Votre engagement bénévole a été enregistré`,
      });

      onSuccess();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md flex flex-col border-0 shadow-lg" style={{ maxHeight: '90vh' }}>
        <CardHeader className="sticky top-0 bg-background z-10 border-b p-6 pb-4">
          <h3 className="text-xl font-semibold">Faire un don</h3>
        </CardHeader>

        <CardContent className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Type selector */}
          <div className="space-y-3">
            <Label>Type de contribution</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={donationType === 'argent' ? 'default' : 'outline'}
                onClick={() => setDonationType('argent')}
                className="h-14 flex flex-col gap-1.5"
              >
                <HandCoins size={18} />
                <span className="text-xs">Financier</span>
              </Button>
              <Button
                type="button"
                variant={donationType === 'materiel' ? 'default' : 'outline'}
                onClick={() => setDonationType('materiel')}
                className="h-14 flex flex-col gap-1.5"
              >
                <Box size={18} />
                <span className="text-xs">Matériel</span>
              </Button>
              <Button
                type="button"
                variant={donationType === 'benevolat' ? 'default' : 'outline'}
                onClick={() => setDonationType('benevolat')}
                className="h-14 flex flex-col gap-1.5"
              >
                <HeartHandshake size={18} />
                <span className="text-xs">Bénévolat</span>
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Financial donation */}
            {donationType === 'argent' && (
              <div className="space-y-4">
                <div>
                  <Label>Montant (DH)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {predefinedAmounts.map(amt => (
                      <Button
                        key={amt}
                        type="button"
                        variant={amount === amt ? "default" : "outline"}
                        className="h-10 px-3 min-w-[60px]"
                        onClick={() => setAmount(amt)}
                      >
                        {amt}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Montant personnalisé</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">DH</span>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="pl-10"
                      min={1}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Material donation */}
            {donationType === 'materiel' && (
              <div className="space-y-4">
                <div>
                  <Label>Nom du matériel *</Label>
                  <Input
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder="Ex: Médicaments, vêtements..."
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantité *</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="mt-2"
                      min={1}
                    />
                  </div>
                  <div>
                    <Label>État</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2">
                      <option>Neuf</option>
                      <option>Bon état</option>
                      <option>Usagé</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={materialDescription}
                    onChange={(e) => setMaterialDescription(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Photos</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Max 5 photos</p>
                </div>
              </div>
            )}

            {/* Volunteer */}
            {donationType === 'benevolat' && (
              <div className="space-y-4">
                <div>
                  <Label>Disponibilité *</Label>
                  <Input
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="Ex: Week-ends, 2h par jour..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Compétences</Label>
                  <Textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Décrivez vos compétences..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Common fields */}
            <div>
              <Label>
                {donationType === 'benevolat' ? 'Message' : 'Message d\'accompagnement'}
              </Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            {donationType !== 'benevolat' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <Label htmlFor="anonymous">Rendre anonyme</Label>
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="sticky bottom-0 bg-background border-t p-6 pt-4">
          <div className="flex gap-3 w-full">
            <Button
              type="submit"
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : 
                donationType === 'argent' ? "Confirmer le don" :
                donationType === 'materiel' ? "Envoyer le matériel" :
                "S'engager"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DonateForm;