import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";
import { toast } from "react-toastify";

function AddIncomeModal({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
}) {
  const [form] = Form.useForm();

  // Actualiza la función de validación para que acepte valores entre 1 y 8 dígitos.
  const validateAmount = (value) => {
    const numberValue = Number(value); // Convierte el valor a número
    if (isNaN(numberValue) || numberValue <= 0) {
      return Promise.reject(
        new Error("La cantidad del ingreso debe ser un número positivo")
      );
    }
    if (value.length < 2 || value.length > 8) {
      return Promise.reject(
        new Error("La cantidad debe ser un número entre 2 y 8 dígitos")
      );
    }
    return Promise.resolve();
  };

  const validateName = (value) => {
    if (value.length < 5 || value.length > 20) {
      return Promise.reject(
        new Error("El nombre del ingreso debe tener entre 5 y 20 caracteres")
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
            type="text" // Usa tipo text para permitir validaciones de longitud
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
