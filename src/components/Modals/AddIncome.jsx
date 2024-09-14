import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";
import { toast } from "react-toastify";

function AddIncomeModal({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
}) {
  const [form] = Form.useForm();

  const validateAmount = (value) => {
    const regex = /^[1-9]{2,8}$/; 
    if (!regex.test(value)) {
      return Promise.reject(
        new Error("La cantidad debe ser un número entre 2 y 8 dígitos")
      );
    }
    if (value <= 0) {
      return Promise.reject(
        new Error("La cantidad del ingreso debe ser mayor a 0")
      );
    }
    return Promise.resolve();
  };

  const validateName = (value) => {
    if (value.length < 5 || value.length > 20) {
      return Promise.reject(
        new Error("El nombre debe tener entre 5 y 20 caracteres")
      );
    }
    return Promise.resolve();
  };

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
            {
              validator: (_, value) => validateName(value),
            },
          ]}
        >
          <Input
            type="text"
            className="border border-gray-400 rounded-lg p-2 w-full"
          />
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
            {
              validator: (_, value) => validateAmount(value),
            },
          ]}
        >
          <Input
            type="number"
            className="border border-gray-400 rounded-lg p-2 w-full"
          />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Fecha"
          name="date"
          rules={[{ required: true, message: "Por favor agregar la fecha!" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            className="border border-gray-400 rounded-lg p-2 w-full"
          />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Categoría"
          name="tag"
          rules={[
            { required: true, message: "Por favor selecciona la categoría!" },
          ]}
        >
          <Select className="border border-gray-400 rounded-lg p-2 w-full">
            <Select.Option value="salario">Salario</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="inversiones">Inversión</Select.Option>
            <Select.Option value="otros">Otros</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            type="primary"
            htmlType="submit"
          >
            Registrar ingreso
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;
