import { useState, useEffect, useContext } from "react";
import { ExpenseContext } from "../store/expense-context";

export default function ExpenseFilter({
  monthFilterIsOpen,
  onMonthFilterIsOpen,
}) {
  const { expenses, setTemporalExpenses } = useContext(ExpenseContext);
  const [filterOptions, setFilterOptions] = useState({
    months: [],
    owners: [],
    creditCards: [],
    quotas: [],
  });
  const [filters, setFilters] = useState({
    months: [],
    owners: [],
    creditCards: [],
    quotas: [],
  });

  useEffect(() => {
    let expenseMonths = [];
    let expenseOwners = [];
    let expenseCreditCards = [];
    let expenseQuotas = [];

    expenses.map((expense) => {
      expenseMonths.push(expense.month);
      expenseOwners.push(expense.owners);
      expenseCreditCards.push(expense.creditCards);
      expenseQuotas.push(expense.quotas);
    });

    setFilterOptions(() => {
      const updateFilterOptions = {
        months: [...Array.from(new Set(expenseMonths))],
        owners: [...Array.from(new Set(expenseOwners))],
        creditCards: [...Array.from(new Set(expenseCreditCards))],
        quotas: [...Array.from(new Set(expenseQuotas))],
      };

      return updateFilterOptions;
    });
  }, [expenses]);

  function handleApplyMonthFilter() {
    setTemporalExpenses(() => {
      const updateExpenses = expenses.filter((expense) =>
        filters.months.includes(expense.month)
      );

      return updateExpenses;
    });
    onMonthFilterIsOpen();
  }

  function handleCancelMonthFilter() {
    onMonthFilterIsOpen();
  }

  function handleSelectedMonthFilter(event) {
    setFilters((prevFilters) => {
      let updateFilters = { ...prevFilters };
      if (
        !event.target.checked &&
        prevFilters.months.includes(event.target.value)
      ) {
        updateFilters.months = prevFilters.months.filter(
          (month) => month != event.target.value
        );
      } else if (event.target.checked) {
        updateFilters = {
          ...prevFilters,
          months: [...prevFilters.months, event.target.value],
        };
      }

      return updateFilters;
    });
  }

  return (
    <div
      id="dropdownSearch"
      className={
        !monthFilterIsOpen
          ? "z-10  transition scale-y-0 -translate-y-40 duration-0 ease-linear absolute mt-10  bg-white rounded-lg shadow w-60 dark:bg-gray-700 overflow-hidden"
          : "z-10 transition ease-out absolute mt-10  bg-white rounded-lg shadow w-60 dark:bg-gray-700 overflow-hidden"
      }
    >
      <div className="p-3">
        <label htmlFor="input-group-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="input-group-search"
            className="block w-full p-2 ps-10 text-sm rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-2 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            placeholder="Search month"
          />
        </div>
      </div>
      <ul
        className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700"
        aria-labelledby="dropdownSearchButton"
      >
        {filterOptions.months.map((month) => (
          <li key={month}>
            <div className="flex items-center ps-2 rounded hover:bg-gray-100">
              <input
                onChange={(event) => handleSelectedMonthFilter(event)}
                id="checkbox-item-11"
                type="checkbox"
                value={month}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
              <label
                htmlFor="checkbox-item-11"
                className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded"
              >
                {month}
              </label>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100">
        <button onClick={handleApplyMonthFilter}>Apply</button>
        <button onClick={handleCancelMonthFilter}>Cancel</button>
      </div>
    </div>
  );
}
