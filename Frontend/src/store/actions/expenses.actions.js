import { ExpensesEndPoints } from '../common/endpoints';
import API from '../common/api';

export const fetchExpensesByDate = async (date) => {
  if (!date) return;
  const obj = {
    url: `${ExpensesEndPoints.GetExpense(date)}`,
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

export const deleteExpense = async (id) => {
  const obj = {
    url: `${ExpensesEndPoints.DeleteExpense(id)}`,
    method: 'DELETE',
  };
  return await API(obj);
};

export const getMonthlySummary = async ({ selectedDate }) => {
  const obj = {
    url: `${ExpensesEndPoints.GetMonthlySummary(selectedDate)}`,
  };
  return await API(obj);
};
