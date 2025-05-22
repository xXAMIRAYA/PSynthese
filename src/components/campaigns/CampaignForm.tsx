// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent } from '@/components/ui/card';
// import { useToast } from '@/components/ui/use-toast';
// import { useAuth } from '@/contexts/AuthContext';
// import { createCampaign, CampaignFormData } from '@/services/campaignService';

// const CampaignForm = () => {
//   const [formData, setFormData] = useState<CampaignFormData>({
//     title: '',
//     description: '',
//     category: '',
//     location: '',
//     target: 0,
//     end_date: '',
//     image: null,
//     donation_type: '',
//     quantity: undefined,
//     activity: '',
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { user } = useAuth();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData(prev => ({ ...prev, image: file }));
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!user) {
//       toast({
//         title: "Erreur",
//         description: "Vous devez être connecté pour créer une campagne",
//         variant: "destructive",
//       });
//       return;
//     }

//     const { title, description, category, location, end_date, donation_type, target, quantity, activity } = formData;

//     if (!title || !description || !category || !location || !end_date || !donation_type) {
//       toast({
//         title: "Formulaire incomplet",
//         description: "Veuillez remplir tous les champs obligatoires",
//         variant: "destructive",
//       });
//       return;
//     }

//     const endDate = new Date(end_date);
//     if (endDate <= new Date()) {
//       toast({
//         title: "Date invalide",
//         description: "La date de fin doit être dans le futur",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (donation_type === "argent" && (!target || target <= 0)) {
//       toast({
//         title: "Objectif manquant",
//         description: "Veuillez définir un objectif financier valide",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (donation_type === "materiel" && (!quantity || quantity <= 0)) {
//       toast({
//         title: "Quantité manquante",
//         description: "Veuillez définir une quantité valide",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (donation_type === "benevolat" && !activity.trim()) {
//       toast({
//         title: "Activité manquante",
//         description: "Veuillez décrire l'activité bénévole",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Create base payload with required fields
//       const payload: any = {
//         title: formData.title,
//         description: formData.description,
//         category: formData.category,
//         location: formData.location,
//         end_date: formData.end_date,
//         donation_type: formData.donation_type, // Ensure this is not empty
//         created_by: user.id,
//       };

//       // Add conditional fields based on donation type
//       if (formData.donation_type === 'argent') {
//         payload.target = formData.target;
//       } else if (formData.donation_type === 'materiel') {
//         payload.quantity = formData.quantity;
//       } else if (formData.donation_type === 'benevolat') {
//         payload.activity = formData.activity;
//       }

//       // Add image if present
//       if (formData.image) {
//         payload.image = formData.image;
//       }

//       // Debug: log the individual fields
//       console.log('Form data donation_type:', formData.donation_type);
//       console.log('Payload donation_type:', payload.donation_type);
//       console.log('Full payload:', JSON.stringify(payload, null, 2));

//       const campaign = await createCampaign(payload, user.id);

//       toast({
//         title: "Campagne créée",
//         description: "Votre campagne a été créée avec succès",
//       });

//       navigate(`/campaign/${campaign.id}`);
//     } catch (error) {
//       console.error('Error creating campaign:', error);
//       toast({
//         title: "Erreur",
//         description: "Une erreur est survenue lors de la création",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

  
//   return (
//     <Card className="max-w-4xl mx-auto">
//       <CardContent className="pt-6">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid gap-6 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="title">Titre *</Label>
//               <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
//             </div>

//             <div className="space-y-2">
//               <Label>Catégorie *</Label>
//               <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)} required>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choisir une catégorie" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="emergency">Urgence</SelectItem>
//                   <SelectItem value="research">Recherche</SelectItem>
//                   <SelectItem value="equipment">Équipement</SelectItem>
//                   <SelectItem value="care">Soins</SelectItem>
//                   <SelectItem value="awareness">Sensibilisation</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label>Description *</Label>
//             <Textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Décrivez votre campagne"
//               required
//               className="min-h-[150px]"
//             />
//           </div>

//           <div className="grid gap-6 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label>Localisation *</Label>
//               <Input name="location" value={formData.location} onChange={handleChange} required />
//             </div>

//             <div className="space-y-2">
//               <Label>Type de don *</Label>
//               <Select
//                 value={formData.donation_type}
//                 onValueChange={(value) => {
//                   console.log("Changement de donation_type:", value);
//                   handleSelectChange('donation_type', value);
//                 }}
//                 required
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choisir le type de don" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="argent">Argent</SelectItem>
//                   <SelectItem value="materiel">Matériel</SelectItem>
//                   <SelectItem value="benevolat">Bénévolat</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid gap-6 sm:grid-cols-2">
//             <div className="space-y-2">
//               <Label>Date de fin *</Label>
//               <Input name="end_date" type="date" value={formData.end_date} onChange={handleChange} required />
//             </div>

//             {formData.donation_type === 'argent' && (
//               <div className="space-y-2">
//                 <Label>Objectif (€) *</Label>
//                 <Input
//                   type="number"
//                   min="1"
//                   value={formData.target || ''}
//                   onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 0 })}
//                   required
//                 />
//               </div>
//             )}

//             {formData.donation_type === 'materiel' && (
//               <div className="space-y-2">
//                 <Label>Quantité *</Label>
//                 <Input
//                   type="number"
//                   min="1"
//                   value={formData.quantity || ''}
//                   onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
//                   required
//                 />
//               </div>
//             )}

//             {formData.donation_type === 'benevolat' && (
//               <div className="space-y-2">
//                 <Label>Activité *</Label>
//                 <Input
//                   type="text"
//                   value={formData.activity}
//                   onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
//                   required
//                 />
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label>Image</Label>
//               <Input type="file" accept="image/*" onChange={handleImageChange} />
//             </div>
//           </div>

//           {imagePreview && (
//             <div className="mt-4">
//               <p className="text-sm mb-2">Aperçu :</p>
//               <img src={imagePreview} alt="Preview" className="w-full max-h-80 object-cover rounded-md" />
//             </div>
//           )}

//           <div className="flex gap-4 pt-4">
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Création..." : "Créer la campagne"}
//             </Button>
//             <Button type="button" variant="outline" onClick={() => navigate('/campaigns')}>
//               Annuler
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default CampaignForm;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createCampaign, CampaignFormData } from '@/services/campaignService';

const CampaignForm = () => {
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    target: 0,
    end_date: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une campagne",
        variant: "destructive",
      });
      return;
    }
    
    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.location || formData.target <= 0 || !formData.end_date) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    // Check if end date is in the future
    const endDate = new Date(formData.end_date);
    if (endDate <= new Date()) {
      toast({
        title: "Date invalide",
        description: "La date de fin doit être dans le futur",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const campaign = await createCampaign(formData, user.id);
      
      toast({
        title: "Campagne créée",
        description: "Votre campagne a été créée avec succès",
      });
      
      navigate(`/campaign/${campaign.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la campagne",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la campagne *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Titre de votre campagne"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Urgence</SelectItem>
                  <SelectItem value="research">Recherche</SelectItem>
                  <SelectItem value="equipment">Équipement</SelectItem>
                  <SelectItem value="care">Soins</SelectItem>
                  <SelectItem value="awareness">Sensibilisation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre campagne en détail"
              required
              className="min-h-[150px]"
            />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Localisation *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ville, Pays"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target">Objectif (€) *</Label>
              <Input
                id="target"
                name="target"
                type="number"
                min="1"
                step="1"
                value={formData.target || ''}
                onChange={handleNumberChange}
                placeholder="Montant à collecter"
                required
              />
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="end_date">Date de fin *</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm mb-2">Aperçu de l'image:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-h-80 object-cover rounded-md" 
              />
            </div>
          )}
          
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer la campagne"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/campaigns')}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CampaignForm;