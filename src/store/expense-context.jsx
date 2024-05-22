import { createContext, useState, useEffect } from "react";
import DUMMY_EXPENSES from "../DummyExpenses";

export const ExpenseContext = createContext({
  immutableExpenses: [],
  temporalExpenses: [],
  setExpenses: () => {},
  setTemporalExpenses: () => {},
  searchExpenses: () => {},
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

  useEffect(() => {
    setTemporalExpenses(immutableExpenses);
  }, [immutableExpenses]);

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

  function handleDeleteExpenses(expensesToRemove) {
    setExpenses((prevExpenses) => {
      const updateExpenses = prevExpenses.filter(
        (item, index) => !expensesToRemove.includes(index)
      );

      return updateExpenses;
    });
  }

  function handleEditExpense(index) {
    setTemporalExpenses((prevExpense) => {
      const updateExpense = [...prevExpense];
      updateExpense[index].edit = true;
      return updateExpense;
    });
  }

  function handleCancelEdit(expense, index) {
    setTemporalExpenses((prevExpense) => {
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
    immutableExpenses,
    temporalExpenses,
    setExpenses,
    setTemporalExpenses,
    searchExpenses: handleSearchExpenses,
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
