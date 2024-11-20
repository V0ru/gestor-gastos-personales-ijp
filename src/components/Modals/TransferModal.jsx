import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { auth, db } from "../../firebase";
import { query, where, getDocs, collection, updateDoc, doc, addDoc } from "firebase/firestore";

function TransferModal({ isVisible, onClose, currentBalance, fetchTransactions }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (values) => {
    const { amount, email, name } = values;
    const transferAmount = parseFloat(amount);

    if (currentBalance < 0 || currentBalance < transferAmount) {
      message.error("Hubo un error con la transferencia, tu saldo es insuficiente");
      return;
    }

    try {
      // Verificar si el correo existe
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        message.error("El correo electrónico no está registrado.");
        return;
      }

      const recipientDoc = querySnapshot.docs[0]; // Obtener el primer documento que coincide
      const recipientId = recipientDoc.id; // ID del destinatario

      // Realizar la transferencia
      const currentUserRef = doc(db, "users", auth.currentUser.uid);
      const recipientUserRef = doc(db, "users", recipientId);

      // Actualizar el saldo del usuario que envía el dinero
      await updateDoc(currentUserRef, {
        balance: currentBalance - transferAmount,
      });

      // Obtener el saldo actual del destinatario
      const recipientData = recipientDoc.data();
      const newRecipientBalance = (recipientData.balance || 0) + transferAmount; // Incrementar el saldo del destinatario

      // Actualizar el saldo del destinatario
      await updateDoc(recipientUserRef, {
        balance: newRecipientBalance,
      });

      // Agregar la transacción al historial del remitente
      await addDoc(collection(db, `users/${auth.currentUser.uid}/transactions`), {
        amount: -transferAmount,
        name: name,
        email: email,
        type: "transferencia",
        date: new Date().toISOString(),
      });

      // Agregar la transacción al historial del destinatario
      await addDoc(collection(db, `users/${recipientId}/transactions`), {
        amount: transferAmount,
        name: name,
        email: auth.currentUser.email,
        type: "transferencia",
        date: new Date().toISOString(),
      });

      message.success("Transferencia realizada con éxito.");
      fetchTransactions(); // Actualizar las transacciones
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error en la transferencia:", error);
      message.error("Hubo un error al realizar la transferencia.");
    }
  };

  return (
    <Modal
      title="Transferir Dinero"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleTransfer}
        className="space-y-4"
      >
        <Form.Item
          label="¿Qué monto desea transferir?"
          name="amount"
          rules={[{ required: true, message: "¡Por favor ingrese el monto!" }]}
        >
          <Input type="number" placeholder="Monto a transferir" />
        </Form.Item>

        <Form.Item
          label="Digite correo electrónico a quien va a transferir"
          name="email"
          rules={[{ required: true, message: "¡Por favor ingrese un correo!" }]}
        >
          <Input type="email" placeholder="Correo electrónico" />
        </Form.Item>

        <Form.Item
          label="Nombre de la transferencia"
          name="name"
          rules={[{ required: true, message: "¡Por favor ingrese un nombre!" }]}
        >
          <Input placeholder="Nombre de la transferencia" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TransferModal; 