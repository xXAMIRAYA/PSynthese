// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { formatISO } from 'date-fns';

// const EditCampaign = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [campaign, setCampaign] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchCampaign = async () => {
//     try {
//       const response = await axios.get(`/api/campaigns/${id}`);
//       setCampaign(response.data);
//     } catch (error) {
//       console.error("Erreur de récupération :", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCampaign(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name, value) => {
//     setCampaign(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.put(`/api/campaigns/${id}`, campaign);
//       navigate('/admin/campaigns');
//     } catch (error) {
//       console.error("Erreur de mise à jour :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCampaign();
//   }, []);

//   if (!campaign) return <div className="p-6">Chargement...</div>;

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-2xl font-semibold mb-6">Modifier la campagne</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Label htmlFor="title">Titre</Label>
//           <Input id="title" name="title" value={campaign.title} onChange={handleChange} required />
//         </div>

//         <div>
//           <Label htmlFor="description">Description</Label>
//           <Textarea id="description" name="description" value={campaign.description} onChange={handleChange} required />
//         </div>

//         <div>
//           <Label htmlFor="category">Catégorie</Label>
//           <Select value={campaign.category} onValueChange={(value) => handleSelectChange("category", value)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Sélectionner une catégorie" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="emergency">Urgence</SelectItem>
//               <SelectItem value="research">Recherche</SelectItem>
//               <SelectItem value="equipment">Équipement</SelectItem>
//               <SelectItem value="care">Soins</SelectItem>
//               <SelectItem value="awareness">Sensibilisation</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div>
//           <Label htmlFor="location">Lieu</Label>
//           <Input id="location" name="location" value={campaign.location} onChange={handleChange} required />
//         </div>

//         <div>
//           <Label htmlFor="target">Objectif (MAD)</Label>
//           <Input id="target" name="target" type="number" value={campaign.target} onChange={handleChange} required />
//         </div>

//         <div>
//           <Label htmlFor="image_url">Image (URL)</Label>
//           <Input id="image_url" name="image_url" value={campaign.image_url || ''} onChange={handleChange} />
//         </div>

//         <div>
//           <Label htmlFor="end_date">Date de fin</Label>
//           <Input
//             id="end_date"
//             name="end_date"
//             type="datetime-local"
//             value={formatISO(new Date(campaign.end_date)).slice(0, 16)}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor="status">Statut</Label>
//           <Select value={campaign.status} onValueChange={(value) => handleSelectChange("status", value)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Sélectionner un statut" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="active">Actif</SelectItem>
//               <SelectItem value="completed">Terminé</SelectItem>
//               <SelectItem value="urgent">Urgent</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Button type="submit" disabled={loading}>
//           {loading ? 'Mise à jour...' : 'Enregistrer'}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default EditCampaign;

import { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, message } from 'antd';
import dayjs from 'dayjs';
import { supabase } from "@/integrations/supabase/client";

const { TextArea } = Input;
const { Option } = Select;

const EditCampaign = ({ campaignId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState(null);

  // Récupérer les données de la campagne
  useEffect(() => {
    const fetchCampaign = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) {
        message.error('Erreur de chargement de la campagne');
        return;
      }

      setCampaign(data);
      form.setFieldsValue({
        ...data,
        end_date: dayjs(data.end_date),
      });
    };

    fetchCampaign();
  }, [campaignId, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    const { error } = await supabase
      .from('campaigns')
      .update({
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        target: values.target,
        end_date: values.end_date.toISOString(),
        status: values.status,
      })
      .eq('id', campaignId);

    setLoading(false);

    if (error) {
      message.error('Erreur lors de la mise à jour');
    } else {
      message.success('Campagne mise à jour avec succès');
    }
  };

  if (!campaign) return <p>Chargement...</p>;

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item name="category" label="Catégorie" rules={[{ required: true }]}>
        <Select>
          <Option value="emergency">Urgence</Option>
          <Option value="research">Recherche</Option>
          <Option value="equipment">Équipement</Option>
          <Option value="care">Soins</Option>
          <Option value="awareness">Sensibilisation</Option>
        </Select>
      </Form.Item>

      <Form.Item name="location" label="Lieu" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="target" label="Objectif (€)" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="end_date" label="Date de fin" rules={[{ required: true }]}>
        <DatePicker showTime style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="status" label="Statut" rules={[{ required: true }]}>
        <Select>
          <Option value="active">Active</Option>
          <Option value="completed">Terminée</Option>
          <Option value="urgent">Urgente</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Mettre à jour
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditCampaign;
