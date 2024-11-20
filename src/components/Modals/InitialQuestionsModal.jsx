import React, { useState } from 'react';
import { Modal, Input, Radio, Button, message } from 'antd';

const InitialQuestionsModal = ({ isVisible, onClose, userName, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    isWorking: null,
    salary: '',
    paymentFrequency: '',
  });

  const handleWorkingAnswer = (value) => {
    setAnswers({ ...answers, isWorking: value });
    if (!value) {
      // Si no está trabajando, guardamos las respuestas y cerramos
      onSubmit({ ...answers, isWorking: value });
      onClose();
    } else {
      setStep(2);
    }
  };

  const handleSalaryChange = (e) => {
    setAnswers({ ...answers, salary: e.target.value });
  };

  const handleFrequencyChange = (e) => {
    setAnswers({ ...answers, paymentFrequency: e.target.value });
  };

  const handleSubmit = () => {
    if (step === 3 && (!answers.salary || !answers.paymentFrequency)) {
      message.error('Por favor completa todos los campos');
      return;
    }
    onSubmit(answers);
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">¿Estás trabajando ahora mismo?</h3>
            <div className="space-x-4">
              <Button onClick={() => handleWorkingAnswer(true)}>Sí</Button>
              <Button onClick={() => handleWorkingAnswer(false)}>No</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">¿Cuál es tu salario?</h3>
            <Input
              type="number"
              prefix="€"
              value={answers.salary}
              onChange={handleSalaryChange}
              placeholder="Ingresa tu salario"
            />
            <Button onClick={() => setStep(3)}>Siguiente</Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">¿Con qué frecuencia recibes tu salario?</h3>
            <Radio.Group onChange={handleFrequencyChange} value={answers.paymentFrequency}>
              <div className="space-y-2">
                <Radio value="daily">Diario</Radio>
                <Radio value="weekly">Semanal</Radio>
                <Radio value="biweekly">Quincenal</Radio>
                <Radio value="monthly">Mensual</Radio>
              </div>
            </Radio.Group>
            <Button onClick={handleSubmit} type="primary">
              Finalizar
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={`¡Hola ${userName}!`}
      open={isVisible}
      footer={null}
      closable={false}
      maskClosable={false}
    >
      <div className="py-4">
        <p className="mb-6">
          Te haremos algunas preguntas para ayudarte a gestionar mejor tus finanzas
        </p>
        {renderStep()}
      </div>
    </Modal>
  );
};

export default InitialQuestionsModal; 