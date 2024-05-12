import SideBar from "./components/SideBar.jsx";
import ExpensesTable from "./components/ExpensesTable.jsx";
import NewExpenseModal from "./components/NewExpenseModal.jsx";
import { useState, useRef } from "react";
import EXPENSE_DATA from "./ExpenseData";

export default function App() {
  const [expenses, setExpenses] = useState(EXPENSE_DATA);
  const [selectedExpenseTableItems, setSelectedExpenseTableItem] = useState([]);
  const modal = useRef();

  function handleOpenExpenses() {
    console.log("Expenses opened");
  }

  function addExpense(
    month,
    owner,
    expenseName,
    category,
    description,
    creditCard,
    quota,
    price
  ) {
    setExpenses((prevExpenses) => {
      const updateExpenses = [
        ...prevExpenses,
        {
          month: month,
          owner: owner,
          name: expenseName,
          category: category,
          description: description,
          creditCard: creditCard,
          quota: quota,
          price: +price,
        },
      ];

      return updateExpenses;
    });
  }

  function handleOpenCartClick() {
    modal.current.open();
  }

  function handleOnChange(event) {
    let updateExpenses;
    if (event.target.value === "") {
      setExpenses(EXPENSE_DATA);
    } else {
      setExpenses(() => {
        updateExpenses = EXPENSE_DATA.filter((item) =>
          item.name.toLowerCase().includes(event.target.value.toLowerCase())
        );

        return updateExpenses;
      });
    }
  }

  function handleSelectedExpenseItems(index, event) {
    setSelectedExpenseTableItem((prevSelectedExpenseTableItems) => {
      let updateSelectedExpenseTableItems;

      if (!event.target.checked) {
        updateSelectedExpenseTableItems = prevSelectedExpenseTableItems.filter(
          (item) => item.tableIndex !== index
        );
      } else {
        updateSelectedExpenseTableItems = [
          ...prevSelectedExpenseTableItems,
          {
            tableIndex: index,
            checkBoxValue: event.target.checked,
          },
        ];
      }

      return updateSelectedExpenseTableItems;
    });
  }

  function handleMasiveDeleteExpenses() {
    const indexToRemove = selectedExpenseTableItems
      .filter((item) => item.checkBoxValue)
      .map((item) => item.tableIndex);

    setExpenses((prevExpenses) => {
      const updateExpenses = prevExpenses.filter(
        (item, index) => !indexToRemove.includes(index)
      );

      return updateExpenses;
    });

    setSelectedExpenseTableItem([]);
  }

  function handleEditExpense(expense, index) {
    setExpenses((prevExpense) => {
      const updateExpense = [...prevExpense];
      updateExpense[index].edit = true;

      return updateExpense;
    });
  }

  function handleCancelEdit(expense, index) {
    setExpenses((prevExpense) => {
      const updateExpense = [...prevExpense];
      updateExpense[index].edit = false;

      return updateExpense;
    });
  }

  function handleSaveEdit(changes, index) {
    setExpenses((prevExpense) => {
      const updateExpense = [...prevExpense];
      updateExpense[index] = changes;

      return updateExpense;
    });
  }

  function handleDeleteExpense(index) {
    setExpenses((prevExpenses) => {
      const updateExpenses = prevExpenses.filter(
        (item, indexItem) => indexItem !== index
      );

      return updateExpenses;
    });
  }

  return (
    <>
      <nav className="h-14 top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"></nav>
      <div className="flex h-screen">
        <SideBar onOpen={handleOpenExpenses}></SideBar>
        <NewExpenseModal
          ref={modal}
          title="Create New Expense"
          onAddExpenses={addExpense}
        ></NewExpenseModal>
        <div className="w-full">
          <div className="flex justify-between">
            <div className="flex justify-normal m-5">
              <input
                onChange={handleOnChange}
                type="text"
                id="table-search"
                className="w-80 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                placeholder="Search for items"
              />
              <button className="ml-4 text-gray-500 hover:text-blue-600">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4"
                  />
                </svg>
              </button>
              <button onClick={handleMasiveDeleteExpenses} className="ml-3">
                <svg
                  className="h-6 w-6 text-gray-500 hover:text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />{" "}
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />{" "}
                  <line x1="10" y1="11" x2="10" y2="17" />{" "}
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
            <button
              onClick={handleOpenCartClick}
              className="bg-blue-700 rounded px-3 py-2  text-white text-sm font-semibold m-6 hover:bg-blue-600"
            >
              + Add expense
            </button>
          </div>
          <ExpensesTable
            expenseData={expenses}
            onSelectedExpenseItems={handleSelectedExpenseItems}
            onEditExpense={handleEditExpense}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDeleteExpense}
          ></ExpensesTable>
        </div>
      </div>
    </>
  );
}
