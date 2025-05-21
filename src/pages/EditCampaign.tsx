import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
} from "antd";
import moment from "moment";
import type { Dayjs } from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

interface CampaignFormValues {
  title: string;
  description: string;
  category: string;
  location: string;
  target: number;
  image_url?: string;
  end_date: Dayjs;
  status: string;
}

const categories = ["emergency", "research", "equipment", "care", "awareness"];
const statuses = ["active", "completed", "urgent"];

const EditCampaign: React.FC = () => {
  const { id: campaignId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaign = async () => {
      setInitialLoading(true);
      try {
        const { data, error } = await supabase
          .from("campaigns")
          .select("*")
          .eq("id", campaignId)
          .single();

        if (error) throw error;

        form.setFieldsValue({
          ...data,
          end_date: moment(data.end_date),
        });
      } catch (error: any) {
        message.error(`Erreur de chargement: ${error.message}`);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, form]);

  const handleUpdate = async (values: CampaignFormValues) => {
    if (!campaignId) return;
    setLoading(true);

    try {
      const updateData = {
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        target: Number(values.target),
        image_url: values.image_url || null,
        end_date: values.end_date.toISOString(),
        status: values.status,
      };

      console.log("ID campagne à mettre à jour :", campaignId);
      console.log("Données à mettre à jour :", updateData);

      const { data, error } = await supabase
        .from("campaigns")
        .update(updateData)
        .eq("id", campaignId)
        .select(); // IMPORTANT pour récupérer la réponse

      if (error) throw error;

      console.log("Mise à jour réussie :", data);

      message.success("Campagne mise à jour avec succès!");
      navigate(`/campaign/${campaignId}`);
    } catch (error: any) {
      console.error("Erreur complète:", error);
      message.error(`Échec de la mise à jour: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Modifier la campagne</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
        initialValues={{ status: "active" }}
      >
        <Form.Item
          label="Titre"
          name="title"
          rules={[{ required: true, message: "Champ obligatoire" }]}
        >
          <Input placeholder="Titre de la campagne" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Champ obligatoire" }]}
        >
          <TextArea rows={4} placeholder="Description complète" />
        </Form.Item>

        <Form.Item
          label="Catégorie"
          name="category"
          rules={[{ required: true, message: "Champ obligatoire" }]}
        >
          <Select placeholder="Sélectionnez une catégorie">
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Localisation"
          name="location"
          rules={[{ required: true, message: "Champ obligatoire" }]}
        >
          <Input placeholder="Lieu de la campagne" />
        </Form.Item>

        <Form.Item
          label="Objectif financier"
          name="target"
          rules={[{ required: true, message: "Champ obligatoire" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "") || ""}
          />
        </Form.Item>

        <Form.Item label="URL de l'image" name="image_url">
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>

        <Form.Item
          label="Date de fin"
          name="end_date"
          rules={[{ required: true, message: "Champ obligatoire" }]}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            disabledDate={(current) => current && current < moment().startOf("day")}
          />
        </Form.Item>

        <Form.Item
          label="Statut"
          name="status"
          rules={[{ required: true, message: "Champ obligatoire" }]}
        >
          <Select>
            {statuses.map((status) => (
              <Option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Enregistrer les modifications
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Annuler
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCampaign;
