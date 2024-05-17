import { createContext, useState, useEffect } from "react";
import DUMMY_EXPENSES from "../DummyExpenses";

export const ExpenseContext = createContext({
  expenses: [],
  temporalExpenses: [],
  setExpenses: () => {},
  setTemporalExpenses: () => {},
  searchExpenses: () => {},
  selectedExpenses: () => {},
  deleteExpenses: () => {},
  editExpense: () => {},
  cancelExpenseEdit: () => {},
  saveExpenseEdit: () => {},
  deleteExpense: () => {},
});

export default function ExpenseContextProvider({ children }) {
  const [expenses, setExpenses] = useState(DUMMY_EXPENSES);
  const [temporalExpenses, setTemporalExpenses] = useState([]);
  const [immutableExpenses, setImmutableExpenses] = useState([]);
  const [selectedExpenseTableItems, setSelectedExpenseTableItem] = useState([]);

  useEffect(() => {
    setTemporalExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    setImmutableExpenses(expenses);
  }, [expenses]);

  function handleSearchExpenses(event) {
    let updateExpenses;
    if (event.target.value === "") {
      setTemporalExpenses(immutableExpenses);
    } else {
      setTemporalExpenses(() => {
        updateExpenses = immutableExpenses.filter((item) =>
          item.name.toLowerCase().includes(event.target.value.toLowerCase())
        );

        return updateExpenses;
      });
    }
  }

  function handleSelectedExpenses(index, event) {
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

  function handleDeleteExpenses() {
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

  function handleEditExpense(index) {
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

  const ctxValue = {
    expenses,
    temporalExpenses,
    setExpenses,
    setTemporalExpenses,
    searchExpenses: handleSearchExpenses,
    selectedExpenses: handleSelectedExpenses,
    deleteExpenses: handleDeleteExpenses,
    editExpense: handleEditExpense,
    cancelExpenseEdit: handleCancelEdit,
    saveExpenseEdit: handleSaveEdit,
    deleteExpense: handleDeleteExpense,
  };

  return (
    <ExpenseContext.Provider value={ctxValue}>
      {children}
    </ExpenseContext.Provider>
  );
}
