import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";

function AddExpenseModal({
  isExpenseModalVisible,
  handleExpenseCancel,
  onFinish,
}) {
  const [form] = Form.useForm();

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
              message: "¡Por favor ingrese el monto del gasto!",
            },
          ]}
        >
          <Input type="number" className="border border-gray-400 rounded-lg p-2 w-full" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            { required: true, message: "¡Por favor seleccione una fecha!" },
          ]}
        >
          <DatePicker className="border border-gray-400 rounded-lg p-2 w-full" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Categoria"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[
            { required: true, message: "¡Por favor selecciona una categoria!" },
          ]}
        >
          <Select className="border border-gray-400 rounded-lg p-2 w-full">
            <Select.Option value="comida">Comida</Select.Option>
            <Select.Option value="educacion">Educacion</Select.Option>
            <Select.Option value="oficio">Oficio</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="bg-blue-500 text-white px-4 py-2 rounded-lg" type="primary" htmlType="submit">
            Registrar gastos
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;
