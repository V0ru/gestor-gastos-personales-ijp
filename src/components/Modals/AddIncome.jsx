import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";

function AddIncomeModal({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
}) {
  const [form] = Form.useForm();

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Agregar Ingresos"
      visible={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "ingreso");
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Nombre"
          name="name"
          rules={[
            {
              required: true,
              message: "¡Por favor ingrese el nombre de la transacción!",
            },
          ]}
        >
          <Input type="text" className="border border-gray-400 rounded-lg p-2 w-full" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Cantidad"
          name="amount"
          rules={[
            {
              required: true,
              message: "¡Por favor ingrese el monto del ingreso!",
            },
          ]}
        >
          <Input type="number" className="border border-gray-400 rounded-lg p-2 w-full" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[{ required: true, message: "Por favor agregar la fecha!" }]}
        >
          <DatePicker format="YYYY-MM-DD" className="border border-gray-400 rounded-lg p-2 w-full" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Categoria"
          name="tag"
          rules={[
            { required: true, message: "Por favor selecciona la categoria!" },
          ]}
        >
          <Select className="border border-gray-400 rounded-lg p-2 w-full">
            <Select.Option value="salario">Salario</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="inversiones">Inversión</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="bg-blue-500 text-white px-4 py-2 rounded-lg" type="primary" htmlType="submit">
            Registrar ingreso
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;
