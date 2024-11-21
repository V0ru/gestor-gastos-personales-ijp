import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleOutlined,
  MoneyCollectOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">
          Bienvenido a <span className="text-theme bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">FinanDay</span>
        </h2>
        <p className="text-center text-gray-600 text-lg">
          Esta aplicación te ayudará a gestionar tus finanzas personales de manera efectiva.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white border border-green-500 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <CheckCircleOutlined className="text-green-500 text-5xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Registro de Transacciones</h3>
            <p className="text-gray-500">
              Agrega tus ingresos y gastos fácilmente para llevar un control de tus finanzas.
            </p>
          </div>
          <div className="bg-white border border-yellow-500 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <MoneyCollectOutlined className="text-yellow-500 text-5xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Visualización de Datos</h3>
            <p className="text-gray-500">
              Visualiza tus ingresos y gastos a través de gráficos interactivos.
            </p>
          </div>
          <div className="bg-white border border-blue-500 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <BarChartOutlined className="text-blue-500 text-5xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Estadísticas Financieras</h3>
            <p className="text-gray-500">
              Obtén un resumen de tu situación financiera con estadísticas claras.
            </p>
          </div>
          <div className="bg-white border border-red-500 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <FileTextOutlined className="text-red-500 text-5xl mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Descarga de Reportes</h3>
            <p className="text-gray-500">
              Descarga tu historial de transacciones en formato PDF o CSV.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/sing')}
            className="px-8 py-3 bg-blue-700 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          >
            Comenzar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
