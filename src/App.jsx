import SideBar from "./components/SideBar.jsx";
import ExpensesTable from "./components/ExpensesTable.jsx";
import ExpenseContextProvider from "./store/expense-context.jsx";

export default function App() {
  function handleOpenExpenses() {
    console.log("Expenses opened");
  }

  return (
    <>
      <nav className="h-14 top-0 z-50 w-full bg-white border-b border-gray-200"></nav>
      <div className="flex h-screen">
        <SideBar onOpen={handleOpenExpenses}></SideBar>
        <ExpenseContextProvider>
          <ExpensesTable />
        </ExpenseContextProvider>
      </div>
    </>
  );
}
