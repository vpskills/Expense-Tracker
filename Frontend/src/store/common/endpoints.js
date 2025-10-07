export const ExpensesEndPoints = {
  GetExpense: (date) => `api/v1/expenses/get?date=${date}`,
  AddExpense: 'api/v1/expenses/add',
  UpdateExpense: 'url',
  DeleteExpense: (id) => `api/v1/expenses/delete?id=${id}`,
  EditExpense: 'api/v1/expenses/edit',
  GetMonthlySummary: (selectedDate) =>
    `api/v1/expenses/summary/month/?selectedDate=${selectedDate}`,
  GetYearlySummary: (selectedDate) =>
    `api/v1/expenses/summary/year/?selectedDate=${selectedDate}`,
};

export const AuthEndPoints = {
  Signin: 'api/v1/user/signin',
  Signup: 'api/v1/user/signup',
  GetUser: 'api/v1/user/get-user',
  Logout: 'api/v1/user/logout',
  GoogleAuth: 'api/v1/user/auth/google',
};

export const CategoriesEndPoints = {
  GetCategories: (page, limit) => `api/v1/categories/get/?page=${page}&limit=${limit}`,
};
