import transactions from "../assets/transactions.svg";

function NoTransactions() {
  return (
    <div className="flex justify-center items-center w-full flex-col mb-8">
      <img src={transactions} className="w-64 my-16" alt="No transactions" />
      <p className="text-center text-lg">No tienes transacciones actualmente</p>
    </div>
  );
}

export default NoTransactions;
