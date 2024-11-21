import React, { useEffect } from "react";
import { Card, Row, message, notification, Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getDatabase, ref, update } from 'firebase/database';

function Cards({
  currentBalance,
  income,
  expenses,
  showExpenseModal,
  showIncomeModal,
  showGoalModal,
  savingGoal,
  goalProgress,
  userId
}) {
  const { confirm } = Modal;

  useEffect(() => {
    if (currentBalance < 0) {
      message.warning("¡Alerta de Presupuesto! Tu saldo actual es negativo.");
      showFinancialNotification();
    }
  }, [currentBalance]);

  const showFinancialNotification = () => {
    notification.warning({
      message: 'Recomendación Financiera',
      description: (
        <span>
          Tu saldo actual es negativo.{" "}
          <span style={{ color: "blue", cursor: "pointer" }} onClick={showFinancialAdvice}>
            Haz clic aquí
          </span>{" "}
          para ver recomendaciones.
        </span>
      ),
      duration: 0, // La notificación no se cerrará automáticamente
    });
  };

  const showFinancialAdvice = () => {
    notification.info({
      message: 'Recomendaciones Financieras',
      description: (
        <div>
          <p>Tu saldo actual es negativo. Aquí tienes algunas recomendaciones:</p>
          <ul>
            <li>Revisa tus gastos y elimina los no esenciales.</li>
            <li>Intenta aumentar tus ingresos con trabajos extra o vendiendo artículos innecesarios.</li>
            <li>Establece un presupuesto mensual y síguelo estrictamente.</li>
            <li>Considera hablar con un asesor financiero para obtener más ayuda.</li>
          </ul>
        </div>
      ),
      duration: 0, // La notificación no se cerrará automáticamente
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const showConfirmReset = () => {
    confirm({
      title: '¿Estás seguro que deseas limpiar el saldo?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción eliminará todos los registros de ingresos y gastos. No podrás recuperar esta información.',
      okText: 'Sí, limpiar',
      cancelText: 'Cancelar',
      centered: true,
      className: 'rounded-2xl',
      okButtonProps: {
        className: 'bg-red-500 hover:bg-red-600 border-none',
        danger: true,
      },
      onOk() {
        reset();
      },
      onCancel() {
        // No hace nada, solo cierra el modal
      },
    });
  };

  const reset = async () => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `usuarios/${userId}`);
      await update(userRef, {
        balance: 0,
        ingresos: [],
        gastos: []
      });
      message.success("Saldo limpiado exitosamente.");
    } catch (error) {
      message.error("Error al limpiar el saldo: " + error.message);
    }
  };

  return (
    <div className="cards-container">
      <Row className="flex flex-wrap gap-6">
        <Card 
          className="flex-1 min-w-[300px] transform transition-all duration-300 hover:scale-105"
          style={{
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
          bodyStyle={{ padding: '1.5rem' }}
        >
          <div className="text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Saldo Actual</h2>
              <span className="text-3xl">💰</span>
            </div>
            <p className={`text-3xl font-bold mb-4 ${currentBalance < 0 ? 'text-red-300' : currentBalance > 0 ? 'text-green-300' : 'text-white'}`}>
              {formatCurrency(currentBalance)}
            </p>
            <button 
              className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2"
              onClick={showConfirmReset}
            >
              <span>Limpiar Saldo</span>
              <i className="fas fa-refresh"></i>
            </button>
          </div>
        </Card>

        <Card 
          className="flex-1 min-w-[300px] transform transition-all duration-300 hover:scale-105"
          style={{
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
          bodyStyle={{ padding: '1.5rem' }}
        >
          <div className="text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ingreso Total</h2>
              <span className="text-3xl">💸</span>
            </div>
            <p className="text-3xl font-bold mb-4">
              {formatCurrency(income)}
            </p>
            <button 
              className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2"
              onClick={showIncomeModal}
            >
              <span>Agregar Ingreso</span>
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </Card>

        <Card 
          className="flex-1 min-w-[300px] transform transition-all duration-300 hover:scale-105"
          style={{
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
          bodyStyle={{ padding: '1.5rem' }}
        >
          <div className="text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Gasto Total</h2>
              <span className="text-3xl">💳</span>
            </div>
            <p className="text-3xl font-bold mb-4">
              {formatCurrency(expenses)}
            </p>
            <button 
              className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 add-expense-btn"
              onClick={showExpenseModal}
            >
              <span>Agregar Gasto</span>
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
