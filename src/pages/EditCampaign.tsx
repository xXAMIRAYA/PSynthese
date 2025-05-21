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

const { Option } = Select;
const { TextArea } = Input;

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: "emergency" | "research" | "equipment" | "care" | "awareness";
  location: string;
  organizer_id: string;
  target: number;
  raised: number;
  donors_count: number;
  image_url?: string | null;
  end_date: string; // ISO string
  status: "active" | "completed" | "urgent";
}

const categories = ["emergency", "research", "equipment", "care", "awareness"];
const statuses = ["active", "completed", "urgent"];

const EditCampaign: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from<Campaign>("campaigns")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          message.error("Erreur lors du chargement : " + error.message);
          return;
        }
        if (data) {
          form.setFieldsValue({
            ...data,
            end_date: moment(data.end_date),
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id, form]);

  const onFinish = async (values: any) => {
    setLoading(true);

    const updateData = {
      title: values.title,
      description: values.description,
      category: values.category,
      location: values.location,
      organizer_id: values.organizer_id,
      target: values.target,
      raised: values.raised,
      donors_count: values.donors_count,
      image_url: values.image_url,
      end_date: values.end_date.toISOString(),
      status: values.status,
    };

    const { error } = await supabase
      .from("campaigns")
      .update(updateData)
      .eq("id", id);

    setLoading(false);

    if (error) {
      message.error("Erreur lors de la mise à jour : " + error.message);
    } else {
      message.success("Campagne mise à jour avec succès !");
      navigate(`/campaign/${id}`);
    }
  };

  if (loading) return <Spin tip="Chargement..." style={{ marginTop: 50 }} />;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Modifier la campagne</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ raised: 0, donors_count: 0 }}
      >
        <Form.Item
          label="Titre"
          name="title"
          rules={[{ required: true, message: "Le titre est requis" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "La description est requise" }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Catégorie"
          name="category"
          rules={[{ required: true, message: "La catégorie est requise" }]}
        >
          <Select>
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Lieu"
          name="location"
          rules={[{ required: true, message: "Le lieu est requis" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="ID de l'organisateur"
          name="organizer_id"
          rules={[{ required: true, message: "L'organisateur est requis" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Objectif (target)"
          name="target"
          rules={[{ required: true, message: "L'objectif est requis" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Montant levé (raised)" name="raised">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Nombre de donateurs" name="donors_count">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="URL de l'image" name="image_url">
          <Input />
        </Form.Item>

        <Form.Item
          label="Date de fin"
          name="end_date"
          rules={[{ required: true, message: "La date de fin est requise" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Statut" name="status">
          <Select>
            {statuses.map((s) => (
              <Option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Mettre à jour
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCampaign;
