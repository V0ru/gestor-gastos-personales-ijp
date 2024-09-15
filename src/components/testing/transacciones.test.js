import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import AddIncomeModal from "../src/components/AddIncomeModal";
import AddExpenseModal from "../src/components/AddExpenseModal";
import { toast } from "react-toastify";

// Mock de la función toast
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("Pruebas para AddIncomeModal y AddExpenseModal", () => {
  const onFinishMock = jest.fn();
  const handleIncomeCancelMock = jest.fn();
  const handleExpenseCancelMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks antes de cada prueba
  });

  // Prueba para el modal de ingresos
  test("Registro exitoso de ingreso", async () => {
    render(
      <AddIncomeModal
        isIncomeModalVisible={true}
        onFinish={onFinishMock}
        handleIncomeCancel={handleIncomeCancelMock}
      />
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Salario Mensual" },
    });
    fireEvent.change(screen.getByLabelText(/Cantidad/i), {
      target: { value: "3000" },
    });
    fireEvent.change(screen.getByLabelText(/Fecha/i), {
      target: { value: "2023-09-14" },
    });

    fireEvent.mouseDown(screen.getByLabelText(/Categoría/i));
    fireEvent.click(screen.getByText("Salario"));

    fireEvent.click(screen.getByRole("button", { name: /Registrar ingreso/i }));

    expect(onFinishMock).toHaveBeenCalledWith(
      {
        name: "Salario Mensual",
        amount: "3000",
        date: "2023-09-14",
        tag: "salario",
      },
      "ingreso"
    );
    expect(toast.success).toHaveBeenCalledWith("Registro ingreso exitosamente");
  });

  // Prueba para el modal de gastos
  test("Registro exitoso de gasto", async () => {
    render(
      <AddExpenseModal
        isExpenseModalVisible={true}
        onFinish={onFinishMock}
        handleExpenseCancel={handleExpenseCancelMock}
      />
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Compra de libros" },
    });
    fireEvent.change(screen.getByLabelText(/Cantidad/i), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByLabelText(/Fecha/i), {
      target: { value: "2023-09-14" },
    });

    fireEvent.mouseDown(screen.getByLabelText(/Categoria/i));
    fireEvent.click(screen.getByText("Educación"));

    fireEvent.click(screen.getByRole("button", { name: /Registrar gasto/i }));

    expect(onFinishMock).toHaveBeenCalledWith(
      {
        name: "Compra de libros",
        amount: "500",
        date: "2023-09-14",
        tag: "educacion",
      },
      "gasto"
    );
    expect(toast.success).toHaveBeenCalledWith("Registro gasto exitosamente");
  });

  // Prueba para validación de nombre en ingresos
  test("Validación de nombre en ingreso", async () => {
    render(
      <AddIncomeModal
        isIncomeModalVisible={true}
        onFinish={onFinishMock}
        handleIncomeCancel={handleIncomeCancelMock}
      />
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "abc" }, // Nombre muy corto
    });
    fireEvent.click(screen.getByRole("button", { name: /Registrar ingreso/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "El nombre del ingreso debe tener entre 5 y 20 caracteres"
    );
  });

  // Prueba para validación de cantidad en gastos
  test("Validación de cantidad en gasto", async () => {
    render(
      <AddExpenseModal
        isExpenseModalVisible={true}
        onFinish={onFinishMock}
        handleExpenseCancel={handleExpenseCancelMock}
      />
    );

    fireEvent.change(screen.getByLabelText(/Cantidad/i), {
      target: { value: "-100" }, // Cantidad negativa
    });
    fireEvent.click(screen.getByRole("button", { name: /Registrar gasto/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "La cantidad debe ser un número entre 2 y 8 dígitos"
    );
  });
});
