import { ExpensesEndPoints } from "../common/endpoints";
import API from "../common/api";

export const fetchExpensesByDate = async (date) => {
  const obj = {
    url: `${ExpensesEndPoints.GetExpense}`,
    body: JSON.stringify(body),
    isNoToken: true,
  };
  return await API(obj);
};

export const addExpense = async (expense) => {
  const obj = {
    url: `${ExpensesEndPoints.AddExpense}`,
    method: 'POST',
    body: JSON.stringify(expense),
  };
  return await API(obj);
};