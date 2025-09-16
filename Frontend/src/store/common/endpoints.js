export const ExpensesEndPoints = {
  GetExpense: (date) => `api/v1/expenses/get?date=${date}`,
  AddExpense: 'api/v1/expenses/add',
  UpdateExpense: 'url',
  DelteExpense: 'url',
};

export const AuthEndPoints = {
  Signin: 'api/v1/user/signin',
  Signup: 'api/v1/user/signup',
  GetUser: 'api/v1/user/get-user',
  Logout: 'api/v1/user/logout',
};

export const CategoriesEndPoints = {
  GetCategories: (page, limit) => `api/v1/categories/get/?page=${page}&limit=${limit}`,
};
