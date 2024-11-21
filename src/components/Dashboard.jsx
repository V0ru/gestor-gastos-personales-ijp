import React, { useEffect, useState } from "react";
import { Card, Row } from "antd";
import { Line, Pie } from "@ant-design/charts";
import moment from "moment";
import TransactionSearch from "./TransactionSearch";
import Header from "./Header";
import AddIncomeModal from "./Modals/AddIncome";
import AddExpenseModal from "./Modals/AddExpense";
import Cards from "./Cards";
import NoTransactions from "./NoTransactions";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query, deleteDoc, doc, orderBy } from "firebase/firestore";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { unparse } from "papaparse";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import InitialQuestionsModal from './Modals/InitialQuestionsModal';

const Dashboard = () => {
  const [user, userloading] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const navigate = useNavigate();
  const [showInitialQuestions, setShowInitialQuestions] = useState(false);


  useEffect(() => {
    console.log('Transacciones actuales:', transactions);
    calculateTotals();
  }, [transactions]);

  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      console.log('Procesando transacción:', transaction);
      if (transaction.type === 'ingreso') {
        totalIncome += parseFloat(transaction.amount);
      } else if (transaction.type === 'gasto') {
        totalExpenses += parseFloat(transaction.amount);
      }
    });

    console.log('Total Income:', totalIncome);
    console.log('Total Expenses:', totalExpenses);

    setIncome(totalIncome);
    setExpenses(totalExpenses);
    setCurrentBalance(totalIncome - totalExpenses);
  };

  // Función para cargar las transacciones desde Firebase
  const fetchTransactions = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const transactionsRef = collection(db, 'users', user.uid, 'transactions');
      const q = query(transactionsRef, orderBy('date', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const transactionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        amount: parseFloat(doc.data().amount) || 0,
        type: doc.data().type || 'gasto',
        tag: doc.data().tag || 'Sin categoría',
        date: doc.data().date || new Date().toISOString()
      }));
      
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error al cargar las transacciones:", error);
    }
  };

  // Cargar transacciones cuando el componente se monta
  useEffect(() => {
    fetchTransactions();
  }, []);

  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};

    // Agrupa las transacciones por mes
    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      
      if (!balanceData.find(d => d.month === monthYear)) {
        balanceData.push({ 
          month: monthYear, 
          balance: 0 
        });
      }
      
      const monthData = balanceData.find(d => d.month === monthYear);
      if (transaction.type === "income") {
        monthData.balance += transaction.amount;
      } else {
        monthData.balance -= transaction.amount;
        
        // Procesar datos de gastos para el gráfico circular
        if (spendingData[transaction.tag]) {
          spendingData[transaction.tag] += transaction.amount;
        } else {
          spendingData[transaction.tag] = transaction.amount;
        }
      }
    });

    // Ordenar los datos por fecha
    balanceData.sort((a, b) => moment(a.month, "MMM YYYY").diff(moment(b.month, "MMM YYYY")));

    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));

    return { balanceData, spendingDataArray };
  };

  const { balanceData, spendingDataArray } = processChartData();

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  useEffect(() => {
    // Verificar si es la primera vez que el usuario inicia sesión
    const checkFirstTimeUser = async () => {
      if (user) {
        const hasAnsweredQuestions = localStorage.getItem(`initialQuestions_${user.uid}`);
        if (!hasAnsweredQuestions) {
          setShowInitialQuestions(true);
        }
        await fetchTransactions();
      }
    };
    
    checkFirstTimeUser();
  }, [user]);

  const handleInitialQuestionsSubmit = (answers) => {
    // Aquí puedes guardar las respuestas en Firestore si lo deseas
    console.log('Respuestas:', answers);
    localStorage.setItem(`initialQuestions_${user.uid}`, 'true');
    setShowInitialQuestions(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    addTransaction(newTransaction);
    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
  };

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Documento escrito con ID: ", docRef.id);
      toast.success("¡Transacción agregada!");
      fetchTransactions();
    } catch (e) {
      console.error("Error al agregar el documento: ", e);
      toast.error("No se pudo agregar la transacción");
    }
  }

  async function deleteTransaction(transactionId) {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/transactions`, transactionId));
      toast.success("Transacción eliminada con éxito");
      fetchTransactions();
    } catch (error) {
      console.error("Error al eliminar la transacción: ", error);
      toast.error("No se pudo eliminar la transacción");
    }
  }

  const balanceConfig = {
    data: balanceData,
    xField: "month",
    yField: "balance",
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: '#E5E7EB',
            lineWidth: 1,
            lineDash: [4, 5],
            strokeOpacity: 0.7,
          },
        },
      },
    },
    xAxis: {
      grid: {
        line: {
          style: {
            stroke: '#E5E7EB',
          },
        },
      },
    },
    line: {
      size: 2,
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#fff',
        stroke: '#1d4ed8',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: true,
      domStyles: {
        'g2-tooltip': {
          backgroundColor: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          padding: '8px 12px',
          border: '1px solid #E5E7EB',
        },
      },
    },
    theme: {
      styleSheet: {
        backgroundColor: '#fff',
      },
    }
  };

  const spendingConfig = {
    data: spendingDataArray,
    angleField: "value",
    colorField: "category",
    radius: 0.8,
    label: false,
    legend: {
      position: 'bottom',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  function reset() {
    setCurrentBalance(0);
    setIncome(0);
    setExpenses(0);
    setTransactions([]);
    toast.success("Saldo limpio!");
  }

  const cardStyle = {
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    borderRadius: "1rem",
    background: "white",
    border: "none",
  };

  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    // Inicializar el tour guiado
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '.dashboard-container',
          popover: {
            title: 'Bienvenido a tu Panel Financiero',
            description: 'Aquí podrás gestionar todas tus finanzas personales',
            position: 'bottom'
          }
        },
        {
          element: '.cards-container', // Necesitarás agregar esta clase en el componente Cards
          popover: {
            title: 'Resumen Financiero',
            description: 'Visualiza tu balance actual, ingresos y gastos',
            position: 'bottom'
          }
        },
        {
          element: '.add-expense-btn', // Necesitarás agregar esta clase al botón de gastos
          popover: {
            title: 'Agregar Gasto',
            description: 'Haz clic aquí para registrar un nuevo gasto',
            position: 'right'
          }
        },
        {
          element: '.add-income-btn', // Necesitarás agregar esta clase al botón de ingresos
          popover: {
            title: 'Agregar Ingreso',
            description: 'Haz clic aquí para registrar un nuevo ingreso',
            position: 'left'
          }
        }
      ]
    });

    // Iniciar el tour solo para nuevos usuarios o primera visita
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      driverObj.drive();
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  // Agregar esta función para reiniciar el tutorial
  const restartTutorial = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '.dashboard-container',
          popover: {
            title: 'Bienvenido a tu Panel Financiero',
            description: 'Aquí podrás gestionar todas tus finanzas personales',
            position: 'bottom'
          }
        },
        {
          element: '.cards-container',
          popover: {
            title: 'Resumen Financiero',
            description: 'Visualiza tu balance actual, ingresos y gastos',
            position: 'bottom'
          }
        },
        {
          element: '.add-expense-btn',
          popover: {
            title: 'Agregar Gasto',
            description: 'Haz clic aquí para registrar un nuevo gasto',
            position: 'right'
          }
        },
        {
          element: '.add-income-btn',
          popover: {
            title: 'Agregar Ingreso',
            description: 'Haz clic aquí para registrar un nuevo ingreso',
            position: 'left'
          }
        }
      ]
    });
    
    driverObj.drive();
  };

  const addIncome = async (values) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const transactionData = {
        type: 'income',
        amount: parseFloat(values.amount),
        category: values.category,
        description: values.description,
        date: new Date().toISOString(),
      };

      const transactionsRef = collection(db, 'users', user.uid, 'transactions');
      await addDoc(transactionsRef, transactionData);
      
      // Recargar transacciones después de agregar
      await fetchTransactions();
      toast.success('Ingreso agregado exitosamente');
    } catch (error) {
      console.error("Error al agregar ingreso:", error);
      toast.error('Error al agregar ingreso');
    }
  };

  const addExpense = async (values) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const transactionData = {
        type: 'expense',
        amount: parseFloat(values.amount),
        category: values.category,
        description: values.description,
        date: new Date().toISOString(),
      };

      const transactionsRef = collection(db, 'users', user.uid, 'transactions');
      await addDoc(transactionsRef, transactionData);
      
      // Recargar transacciones después de agregar
      await fetchTransactions();
      toast.success('Gasto agregado exitosamente');
    } catch (error) {
      console.error("Error al agregar gasto:", error);
      toast.error('Error al agregar gasto');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={restartTutorial}
            className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center text-2xl font-bold transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{ zIndex: 1000 }}
          >
            ?
          </button>
          
          <div className="mb-8">
            <Cards
              currentBalance={currentBalance}
              income={income}
              expenses={expenses}
              showExpenseModal={showExpenseModal}
              showIncomeModal={showIncomeModal}
              cardStyle={cardStyle}
              reset={reset}
            />
          </div>

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />

          {transactions.length === 0 ? (
            <NoTransactions />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Estadística Financiera
                    </h2>
                    <div className="text-3xl font-bold mb-6">
                      ${currentBalance.toFixed(2)}
                    </div>
                    <div className="h-[300px]">
                      <Line 
                        data={transactions.map(t => ({
                          type: t.type === 'ingreso' ? 'ingreso' : 'gasto',
                          fecha: moment(t.date).format('DD/MM/YY'),
                          valor: t.amount,
                          categoria: t.tag
                        }))}
                        xField="fecha"
                        yField="valor"
                        seriesField="type"
                        smooth={true}
                        animation={{
                          appear: {
                            animation: 'path-in',
                            duration: 1000,
                          },
                        }}
                        legend={{
                          position: 'top'
                        }}
                        color={['#22c55e', '#ef4444']} // verde para ingresos, rojo para gastos
                        point={{
                          size: 5,
                          shape: 'circle',
                          style: {
                            fill: '#fff',
                            lineWidth: 2,
                          },
                        }}
                        tooltip={{
                          showMarkers: true,
                          fields: ['type', 'valor', 'categoria'],
                          formatter: (datum) => ({
                            name: datum.type,
                            value: `$${datum.valor.toFixed(2)} - ${datum.categoria}`
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Distribución de Gastos
                  </h2>
                  <div className="h-[400px]">
                    {spendingDataArray.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No hay gastos registrados aún...
                      </div>
                    ) : (
                      <Pie {...spendingConfig} />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <TransactionSearch
                  transactions={transactions}
                  exportToCsv={exportToCsv}
                  fetchTransactions={fetchTransactions}
                  addTransaction={addTransaction}
                  deleteTransaction={deleteTransaction}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      <InitialQuestionsModal
        isVisible={showInitialQuestions}
        onClose={() => setShowInitialQuestions(false)}
        userName={user?.displayName || 'Usuario'}
        onSubmit={handleInitialQuestionsSubmit}
      />
    </div>
  );
};

export default Dashboard;