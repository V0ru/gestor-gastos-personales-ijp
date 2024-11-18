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
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue < 50) {
      return Promise.reject(
        new Error("La cantidad del ingreso debe ser un número de al menos 50")
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
        new Error("El nombre del ingreso debe tener entre 5 y 20 caracteres")
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
      title={
        <div className="text-xl font-semibold text-gray-800 pb-4 border-b">
          <span className="mr-2">💰</span>
          Agregar Nuevo Ingreso
        </div>
      }
      visible={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
      className="rounded-2xl"
      bodyStyle={{ padding: '24px' }}
      width={480}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "ingreso");
          form.resetFields();
        }}
        className="space-y-4"
      >
        <Form.Item
          label={<span className="text-gray-700 font-medium">Nombre del ingreso</span>}
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
            prefix={<i className="fas fa-file-invoice-dollar text-gray-400 mr-2" />}
            className="h-11 rounded-lg hover:border-green-400 focus:border-green-500 transition-colors"
            placeholder="Ej: Salario mensual"
            maxLength={20}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-700 font-medium">Cantidad</span>}
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
            prefix={<i className="fas fa-euro-sign text-gray-400 mr-2" />}
            className="h-11 rounded-lg hover:border-green-400 focus:border-green-500 transition-colors"
            placeholder="Ej: 1500"
            onChange={handleAmountChange}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-700 font-medium">Fecha</span>}
          name="date"
          rules={[
            { required: true, message: "¡Por favor seleccione una fecha!" },
          ]}
        >
          <DatePicker
            className="h-11 w-full rounded-lg hover:border-green-400 focus:border-green-500 transition-colors"
            format="DD/MM/YYYY"
            placeholder="Selecciona una fecha"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-700 font-medium">Categoría</span>}
          name="tag"
          rules={[
            {
              required: true,
              message: "¡Por favor selecciona una categoría!",
            },
          ]}
        >
          <Select
            className="h-11 rounded-lg"
            placeholder="Selecciona una categoría"
            dropdownClassName="rounded-lg"
          >
            <Select.Option value="salario">💼 Salario</Select.Option>
            <Select.Option value="freelance">💻 Freelance</Select.Option>
            <Select.Option value="inversiones">📈 Inversiones</Select.Option>
            <Select.Option value="negocios">🏪 Negocios</Select.Option>
            <Select.Option value="otros">📦 Otros</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end gap-3">
           <Button
            type="primary"
            htmlType="submit"
            className="h-11 px-6 rounded-lg bg-green-500 hover:bg-green-600 transition-colors border-none"
          >
            <div className="flex items-center gap-2">
              <i className="fas fa-plus-circle"></i>
              <span>Registrar ingreso</span>
            </div>
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;
