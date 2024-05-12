import { useRef, useEffect, useState } from "react";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2, // Esto asegura que siempre se muestren dos dígitos decimales
});

export default function ExpensesTable({
  expenseData,
  onSelectedExpenseItems,
  onEditExpense,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}) {
  const [total, setTotal] = useState(0);
  const [monthFilterIsOpen, setMonthFilterIsOpen] = useState(false);

  const name = useRef();
  const month = useRef();
  const owner = useRef();
  const category = useRef();
  const description = useRef();
  const creditCard = useRef();
  const quota = useRef();
  const price = useRef();

  useEffect(() => {
    const totalTemp = expenseData.reduce(
      (sum, expense) => sum + expense.price,
      0
    );
    setTotal(totalTemp);
  }, [expenseData]);

  function handleDeleteButton(index) {
    onDelete(index);
  }

  function onChangeCheckbox(index, event) {
    onSelectedExpenseItems(index, event);
  }

  function handleEditButton(expense, index) {
    onEditExpense(expense, index);
  }

  function handleCancelEditButton(expense, index) {
    onCancelEdit(expense, index);
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
    onSaveEdit(changes, index);
  }

  function handleMonthFilterIsOpen() {}

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-6">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Expense name
              </th>
              <th scope="col" className="px-6 py-3 flex mt-1">
                <div className="mr-1">Month</div>
                <button onClick={handleMonthFilterIsOpen}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  id="dropdownSearch"
                  className="z-10 absolute mt-10  bg-white rounded-lg shadow w-60 dark:bg-gray-700 overflow-hidden"
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
                    className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownSearchButton"
                  >
                    {expenseData.map((expense) => (
                      <>
                        <li>
                          <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input
                              id="checkbox-item-11"
                              type="checkbox"
                              value=""
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                            />
                            <label
                              htmlFor="checkbox-item-11"
                              className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                            >
                              {expense.month}
                            </label>
                          </div>
                        </li>
                      </>
                    ))}
                  </ul>
                  <div className="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100">
                    <button>Apply</button>
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Owner
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Credit Card
              </th>
              <th scope="col" className="px-6 py-3">
                Quota
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
            {expenseData.length > 0 &&
              expenseData.map((item, index) => (
                <tr
                  key={item.name + index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        onChange={(event) => onChangeCheckbox(index, event)}
                        id="checkbox-table-search-2"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
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
                          onClick={() => handleEditButton(item, index)}
                          type="button"
                          className="text-white bg-blue-700 hover:bg-blue-600  focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center me-2"
                        >
                          <svg
                            className="h-4 w-4 text-white"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                          </svg>
                          <span className="sr-only">Icon description</span>
                        </button>
                        <button
                          onClick={() => handleDeleteButton(index)}
                          type="button"
                          className="text-white bg-red-700 hover:bg-red-600  focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center me-2"
                        >
                          <svg
                            className="h-4 w-4 text-white"
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
                          <span className="sr-only">Icon description</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex">
                        <button
                          onClick={() => handleSaveEditButton(index)}
                          type="button"
                          className="text-white bg-green-700 hover:bg-green-600 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center me-2"
                        >
                          <svg
                            className="h-4 w-4 text-white"
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
                          className="text-white bg-red-700 hover:bg-red-600 focus:outline-none font-medium rounded-full text-sm p-2 text-center inline-flex items-center me-2"
                        >
                          <svg
                            className="h-4 w-4 text-white"
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
            <tr className="font-semibold text-gray-900 dark:text-white">
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
    </>
  );
}
