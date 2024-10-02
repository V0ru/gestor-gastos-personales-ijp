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
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue < 50) {
      return Promise.reject(
        new Error("La cantidad del gasto debe ser un número de al menos 50")
      );
    }
    if (value.length < 2 || value.length > 9) {
      return Promise.reject(
        new Error("La cantidad debe tener entre 2 y 9 dígitos")
      );
    }
    if (value.startsWith('0')) {
      return Promise.reject(
        new Error("La cantidad no puede empezar con cero")
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

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 9) {
      e.target.value = value.slice(0, 9);
    } else {
      e.target.value = value;
    }
    form.setFieldsValue({ amount: e.target.value });
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
            className="border border-gray-400 rounded-lg p-2 w-full"
            onChange={handleAmountChange}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
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