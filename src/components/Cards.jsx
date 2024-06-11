import React, { useEffect } from "react";
import { Card, Row, message, notification } from "antd";

function Cards({
  currentBalance,
  income,
  expenses,
  showExpenseModal,
  showIncomeModal,
  cardStyle,
  reset,
  showGoalModal,
  savingGoal,
  goalProgress
}) {
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

  return (
    <Row className="flex flex-wrap gap-4 justify-between">
      <Card bordered={true} style={cardStyle}>
        <h2 className="text-xl font-semibold">Saldo actual</h2>
        <p className="text-2xl">💵{currentBalance}</p>
        <button className="btn bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={reset}>
          Limpiar Saldo
        </button>
      </Card>

      <Card bordered={true} style={cardStyle}>
        <h2 className="text-xl font-semibold">Ingreso Total</h2>
        <p className="text-2xl">💵{income}</p>
        <button className="btn bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={showIncomeModal}>
          Agregar Ingreso
        </button>
      </Card>

      <Card bordered={true} style={cardStyle}>
        <h2 className="text-xl font-semibold">Gasto Total</h2>
        <p className="text-2xl">💵{expenses}</p>
        <button className="btn bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={showExpenseModal}>
          Agregar Gasto
        </button>
      </Card>
    </Row>
  );
}

export default Cards;
