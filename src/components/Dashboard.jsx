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
import { addDoc, collection, getDocs, query, deleteDoc, doc } from "firebase/firestore";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { unparse } from "papaparse";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const navigate = useNavigate();

  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};

    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      const tag = transaction.tag;

      if (transaction.type === "income") {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance +=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: transaction.amount });
        }
      } else {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance -=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: -transaction.amount });
        }

        if (spendingData[tag]) {
          spendingData[tag] += transaction.amount;
        } else {
          spendingData[tag] = transaction.amount;
        }
      }
    });

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

  //useEffect(() => {
    //fetchTransactions();
  //}, []);

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

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "ingreso") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

 // useEffect(() => {
   // calculateBalance();
  //}, [transactions]);

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

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsArray);
      toast.success("Transacciones obtenidas!");
    }
    setLoading(false);
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
    line: {
      color: '#1d4ed8',
    },
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#1d4ed8',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
  };

  const spendingConfig = {
    data: spendingDataArray,
    angleField: "value",
    colorField: "category",
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
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
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Estadísticas financieras
                  </h2>
                  <div className="h-[400px]">
                    <Line {...balanceConfig} />
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
    </div>
  );
};

export default Dashboard;