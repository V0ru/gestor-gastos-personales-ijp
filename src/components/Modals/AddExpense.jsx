import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";
import { toast } from "react-toastify";

function AddExpenseModal({
  isExpenseModalVisible,
  handleExpenseCancel,
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
    return Promise.resolve(); 
  };

  const validateName = (value) => {
    if (value.length < 5 || value.length > 20) {
      return Promise.reject(
        new Error("El nombre del gasto debe tener entre 5 y 20 caracteres")
      );
    }
    return Promise.resolve(); 
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Agregar gastos"
      visible={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "gasto");
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
            maxLength={20} 
          />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Cantidad"
          name="amount"
          rules={[
            {
              required: true,
              message: "¡Por favor ingrese el monto del gasto!",
            },
            {
              validator: (_, value) => validateAmount(value),
            },
          ]}
        >
          <Input
            type="text"
            maxLength={8} 
            className="border border-gray-400 rounded-lg p-2 w-full"
          />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Fecha"
          name="date"
          rules={[
            { required: true, message: "¡Por favor seleccione una fecha!" },
          ]}
        >
          <DatePicker
            className="border border-gray-400 rounded-lg p-2 w-full"
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          label="Categoria"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[
            {
              required: true,
              message: "¡Por favor selecciona una categoria!",
            },
          ]}
        >
          <Select className="border border-gray-400 rounded-lg p-2 w-full">
            <Select.Option value="comida">Comida</Select.Option>
            <Select.Option value="educacion">Educación</Select.Option>
            <Select.Option value="oficio">Oficio</Select.Option>
            <Select.Option value="gastos_medicos">Gastos Médicos</Select.Option>
            <Select.Option value="otros">Otros</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            type="primary"
            htmlType="submit"
          >
            Registrar gasto
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;
