import { useRef, useEffect, useState, useContext } from "react";
import ExpenseFilter from "./ExpenseFilter";
import { ExpenseContext } from "../store/expense-context";
import NewExpenseModal from "./NewExpenseModal";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2, // Esto asegura que siempre se muestren dos dígitos decimales
});

export default function ExpensesTable() {
  const {
    immutableExpenses,
    temporalExpenses,
    setTemporalExpenses,
    editExpense,
    cancelExpenseEdit,
    saveExpenseEdit,
    deleteExpense,
    searchExpenses,
    deleteExpenses,
  } = useContext(ExpenseContext);

  const [total, setTotal] = useState(0);
  const [selectedExpenseTableItems, setSelectedExpenseTableItem] = useState([]);
  const [filterState, setFilterState] = useState({
    month: {
      options: [],
      selected: [],
      opened: false,
    },
    owner: {
      options: [],
      selected: [],
      opened: false,
    },
    creditCard: {
      options: [],
      selected: [],
      opened: false,
    },
    quota: {
      options: [],
      selected: [],
      opened: false,
    },
  });

  const name = useRef();
  const month = useRef();
  const owner = useRef();
  const category = useRef();
  const description = useRef();
  const creditCard = useRef();
  const quota = useRef();
  const price = useRef();
  const modal = useRef();

  useEffect(() => {
    let expenseMonths = [];
    let expenseOwners = [];
    let expenseCreditCards = [];
    let expenseQuotas = [];

    immutableExpenses.map((expense) => {
      expenseMonths.push(expense.month);
      expenseOwners.push(expense.owner);
      expenseCreditCards.push(expense.creditCard);
      expenseQuotas.push(expense.quota);
    });

    setFilterState((prevFilters) => {
      const updateFilters = {
        month: {
          ...prevFilters.month,
          options: [...Array.from(new Set(expenseMonths))],
        },
        owner: {
          ...prevFilters.owner,
          options: [...Array.from(new Set(expenseOwners))],
        },
        creditCard: {
          ...prevFilters.creditCard,
          options: [...Array.from(new Set(expenseCreditCards))],
        },
        quota: {
          ...prevFilters.quota,
          options: [...Array.from(new Set(expenseQuotas))],
        },
      };
      console.log("useEffect");
      console.log(updateFilters);
      return updateFilters;
    });
  }, [immutableExpenses]);

  useEffect(() => {
    const totalTemp = temporalExpenses.reduce(
      (sum, expense) => sum + +expense.price,
      0
    );
    setTotal(totalTemp);
  }, [temporalExpenses]);

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

  function handleDeleteButton(index) {
    deleteExpense(index);
  }

  function handleEditButton(index) {
    editExpense(index);
  }

  function handleCancelEditButton(expense, index) {
    cancelExpenseEdit(expense, index);
  }

  function handleSaveEditButton(index) {
    const changes = {
      month: month.current.value,
      owner: owner.current.value,
      name: name.current.value,
      category: category.current.value,
      description: description.current.value,
      creditCard: creditCard.current.value,
      quota: quota.current.value,
      price: price.current.value,
      edit: false,
    };
    saveExpenseEdit(changes, index);
  }

  function handleMonthFilterIsOpen() {
    setFilterState((prevFilterState) => {
      const updateFilterState = {
        ...prevFilterState,
        month: {
          ...prevFilterState.month,
          opened: !prevFilterState.month.opened,
        },
      };

      return updateFilterState;
    });
  }

  function handleOwnerFilterIsOpen() {
    setFilterState((prevFilterState) => {
      const updateFilterState = {
        ...prevFilterState,
        owner: {
          ...prevFilterState.owner,
          opened: !prevFilterState.owner.opened,
        },
      };

      return updateFilterState;
    });
  }

  function handleCreditCardFilterIsOpen() {
    setFilterState((prevFilterState) => {
      const updateFilterState = {
        ...prevFilterState,
        creditCard: {
          ...prevFilterState.creditCard,
          opened: !prevFilterState.creditCard.opened,
        },
      };

      return updateFilterState;
    });
  }

  function handleQuotaFilterIsOpen() {
    setFilterState((prevFilterState) => {
      const updateFilterState = {
        ...prevFilterState,
        quota: {
          ...prevFilterState.quota,
          opened: !prevFilterState.quota.opened,
        },
      };

      return updateFilterState;
    });
  }

  function handleOpenNewExpenseModal() {
    modal.current.open();
  }

  function handleDeleteExpenses() {
    const expensesToRemove = selectedExpenseTableItems
      .filter((item) => item.checkBoxValue)
      .map((item) => item.tableIndex);
    deleteExpenses(expensesToRemove);

    setSelectedExpenseTableItem([]);
  }

  function handleSelectValue(event, columnName) {
    setFilterState((prevFilters) => {
      let updateFilters = { ...prevFilters };
      if (
        !event.target.checked &&
        prevFilters[columnName].selected.includes(event.target.value)
      ) {
        updateFilters[columnName].selected = prevFilters[
          columnName
        ].selected.filter((value) => value != event.target.value);
      } else if (event.target.checked) {
        updateFilters = { ...prevFilters };
        updateFilters[columnName] = {
          ...prevFilters[columnName],
          selected: [...prevFilters[columnName].selected, event.target.value],
        };
      }
      console.log(updateFilters);
      return updateFilters;
    });
  }

  function handleApplyFilter() {
    setTemporalExpenses(() => {
      const updateExpenses = immutableExpenses.filter(
        (expense) =>
          (filterState["month"].selected == 0 ||
            filterState["month"].selected.includes(expense["month"])) &&
          (filterState["owner"].selected == 0 ||
            filterState["owner"].selected.includes(expense["owner"])) &&
          (filterState["creditCard"].selected == 0 ||
            filterState["creditCard"].selected.includes(
              expense["creditCard"]
            )) &&
          (filterState["quota"].selected == 0 ||
            filterState["quota"].selected.includes(expense["quota"]))
      );

      return updateExpenses;
    });
  }

  function handleClearFilters() {
    setTemporalExpenses(immutableExpenses);
    window.location.reload();
  }

  return (
    <>
      <NewExpenseModal ref={modal} title="Create New Expense"></NewExpenseModal>
      <div className="w-full">
        <h1 className="m-5 text-2xl font-medium text-black">All expenses</h1>
        <div className="flex justify-between">
          <div className="flex justify-normal m-5">
            <input
              onChange={searchExpenses}
              type="text"
              id="table-search"
              className="w-80 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              placeholder="Search for expenses"
            />
            <button onClick={handleClearFilters} className="ml-3">
              <svg
                className="h-6 w-6 text-gray-500 hover:text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={"#000000"}
                fill={"none"}
              >
                <path
                  d="M20.9987 4.5C20.9869 4.06504 20.8956 3.75346 20.672 3.5074C20.2111 3 19.396 3 17.7657 3H6.23433C4.60404 3 3.7889 3 3.32795 3.5074C2.86701 4.0148 2.96811 4.8008 3.17033 6.3728C3.22938 6.8319 3.3276 7.09253 3.62734 7.44867C4.59564 8.59915 6.36901 10.6456 8.85746 12.5061C9.08486 12.6761 9.23409 12.9539 9.25927 13.2614C9.53961 16.6864 9.79643 19.0261 9.93278 20.1778C10.0043 20.782 10.6741 21.2466 11.226 20.8563C12.1532 20.2006 13.8853 19.4657 14.1141 18.2442C14.1986 17.7934 14.3136 17.0803 14.445 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 7L15 13M21 13L15 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button onClick={handleDeleteExpenses} className="ml-3">
              <svg
                className="h-6 w-6 text-gray-500 hover:text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={"#000000"}
                fill={"none"}
              >
                <path
                  d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M9.5 16.5L9.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M14.5 16.5L14.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={handleOpenNewExpenseModal}
            className="bg-blue-700 rounded px-3 py-2  text-white text-sm font-semibold m-6 hover:bg-blue-600"
          >
            + Add expense
          </button>
        </div>
        <div className="overflow-x-auto shadow-md sm:rounded-lg mx-6">
          <table className="w-full h-auto text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    />
                    <label htmlFor="checkbox-all-search" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Expense name
                </th>
                <th scope="col" className="px-6 py-3 mt-1">
                  <div className="flex">
                    <div className="mr-1">Month</div>
                    <button onClick={handleMonthFilterIsOpen}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={
                          !filterState.month.opened
                            ? "w-4 h-4 transition ease-linear"
                            : "w-4 h-4 transition ease-linear rotate-90"
                        }
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <ExpenseFilter
                      filterIsOpen={filterState.month.opened}
                      handleFilterOpening={handleMonthFilterIsOpen}
                      options={filterState.month.options}
                      applyFilter={handleApplyFilter}
                      onSelectValue={handleSelectValue}
                      placeholder="Search months"
                      filterName="month"
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex">
                    <div className="mr-1">Owner</div>
                    <button onClick={handleOwnerFilterIsOpen}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={
                          !filterState.owner.opened
                            ? "w-4 h-4 transition ease-linear"
                            : "w-4 h-4 transition ease-linear rotate-90"
                        }
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <ExpenseFilter
                      filterIsOpen={filterState.owner.opened}
                      handleFilterOpening={handleOwnerFilterIsOpen}
                      options={filterState.owner.options}
                      applyFilter={handleApplyFilter}
                      onSelectValue={handleSelectValue}
                      placeholder="Search owners"
                      filterName="owner"
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex">
                    <div className="mr-1">Credit Card</div>
                    <button onClick={handleCreditCardFilterIsOpen}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={
                          !filterState.creditCard.opened
                            ? "w-4 h-4 transition ease-linear"
                            : "w-4 h-4 transition ease-linear rotate-90"
                        }
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <ExpenseFilter
                      filterIsOpen={filterState.creditCard.opened}
                      handleFilterOpening={handleCreditCardFilterIsOpen}
                      options={filterState.creditCard.options}
                      applyFilter={handleApplyFilter}
                      onSelectValue={handleSelectValue}
                      placeholder="Search credit card"
                      filterName="creditCard"
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex">
                    <div className="mr-1">Quota</div>
                    <button onClick={handleQuotaFilterIsOpen}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={
                          !filterState.quota.opened
                            ? "w-4 h-4 transition ease-linear"
                            : "w-4 h-4 transition ease-linear rotate-90"
                        }
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <ExpenseFilter
                      filterIsOpen={filterState.quota.opened}
                      handleFilterOpening={handleQuotaFilterIsOpen}
                      options={filterState.quota.options}
                      applyFilter={handleApplyFilter}
                      onSelectValue={handleSelectValue}
                      placeholder="Search quota"
                      filterName="quota"
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {temporalExpenses.length > 0 &&
                temporalExpenses.map((item, index) => (
                  <tr
                    key={item.name + index}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          onChange={(event) =>
                            handleSelectedExpenses(index, event)
                          }
                          id="checkbox-table-search-2"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="checkbox-table-search-2"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {!item.edit ? (
                        item.name
                      ) : (
                        <input
                          ref={name}
                          type="text"
                          id="table-search"
                          className="w-28 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          defaultValue={item.name}
                        />
                      )}
                    </th>
                    <td className="px-6 py-4">
                      {!item.edit ? (
                        item.month
                      ) : (
                        <input
                          ref={month}
                          type="text"
                          id="table-search"
                          className="w-28 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          defaultValue={item.month}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!item.edit ? (
                        item.owner
                      ) : (
                        <input
                          ref={owner}
                          type="text"
                          id="table-search"
                          className="w-28 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          defaultValue={item.owner}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!item.edit ? (
                        item.category
                      ) : (
                        <input
                          ref={category}
                          type="text"
                          id="table-search"
                          className="w-28 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          defaultValue={item.category}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-wrap">
                      {!item.edit ? (
                        item.description
                      ) : (
                        <input
                          ref={description}
                          type="text"
                          id="table-search"
                          className="w-28 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          defaultValue={item.description}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!item.edit ? (
                        item.creditCard
                      ) : (
                        <input
                          ref={creditCard}
                          type="text"
                          id="table-search"
                          className="w-28 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          defaultValue={item.creditCard}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!item.edit ? (
                        item.quota
                      ) : (
                        <input
                          ref={quota}
                          type="text"
                          id="table-search"
                          className="w-28 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          defaultValue={item.quota}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!item.edit ? (
                        formatter.format(item.price)
                      ) : (
                        <input
                          ref={price}
                          type="text"
                          id="table-search"
                          className="w-28 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none focus:border-blue-500 focus:outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                          defaultValue={item.price}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!item.edit ? (
                        <>
                          <button
                            onClick={() => handleEditButton(index)}
                            type="button"
                            className="text-white focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center me-2"
                          >
                            <svg
                              className="h-5 w-5 text-black hover:text-blue-600"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width={24}
                              height={24}
                              color={"#000000"}
                              fill={"none"}
                            >
                              <path
                                d="M3.89089 20.8727L3 21L3.12727 20.1091C3.32086 18.754 3.41765 18.0764 3.71832 17.4751C4.01899 16.8738 4.50296 16.3898 5.47091 15.4218L16.9827 3.91009C17.4062 3.48654 17.618 3.27476 17.8464 3.16155C18.2811 2.94615 18.7914 2.94615 19.2261 3.16155C19.4546 3.27476 19.6663 3.48654 20.0899 3.91009C20.5135 4.33365 20.7252 4.54543 20.8385 4.77389C21.0539 5.20856 21.0539 5.71889 20.8385 6.15356C20.7252 6.38201 20.5135 6.59379 20.0899 7.01735L8.57816 18.5291C7.61022 19.497 7.12625 19.981 6.52491 20.2817C5.92357 20.5823 5.246 20.6791 3.89089 20.8727Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M6 15L9 18M8.5 12.5L11.5 15.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="sr-only">Icon description</span>
                          </button>
                          <button
                            onClick={() => handleDeleteButton(index)}
                            type="button"
                            className="text-white focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center me-2"
                          >
                            <svg
                              className="h-5 w-5 text-black hover:text-red-600"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width={24}
                              height={24}
                              color={"#000000"}
                              fill={"none"}
                            >
                              <path
                                d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M9.5 16.5L9.5 10.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M14.5 16.5L14.5 10.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="sr-only">Icon description</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex">
                          <button
                            onClick={() => handleSaveEditButton(index)}
                            type="button"
                            className="text-white focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center me-2"
                          >
                            <svg
                              className="h-4 w-4 text-black"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path stroke="none" d="M0 0h24v24H0z" />{" "}
                              <path d="M5 12l5 5l10 -10" />
                            </svg>
                            <span className="sr-only">Icon description</span>
                          </button>
                          <button
                            onClick={() => handleCancelEditButton(item, index)}
                            type="button"
                            className="text-white focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center me-2"
                          >
                            <svg
                              className="h-4 w-4 text-black"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />{" "}
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            <span className="sr-only">Icon description</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-900">
                <th scope="row" className="px-6 py-3 text-base"></th>
                <th scope="row" className="px-6 py-3 text-base uppercase">
                  Total
                </th>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3">{formatter.format(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
