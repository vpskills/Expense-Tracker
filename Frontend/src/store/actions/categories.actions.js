import API from '../common/api';
import { CategoriesEndPoints } from '../common/endpoints';

export const fetchCategories = async ({ page = 1, limit = 10 }) => {
  const obj = {
    url: `${CategoriesEndPoints.GetCategories(page, limit)}`,
    method: 'GET',
  };
  return await API(obj);
};

export const addNewCategory = async (body) => {
  const obj = {
    url: `${CategoriesEndPoints.AddCategory}`,
    method: 'POST',
    body: JSON.stringify(body)
  };
  return await API(obj);
};

export const deleteUserCategory = async (id) => {
  const obj = {
    url: `${CategoriesEndPoints.DeleteUserCategory(id)}`,
    method: 'DELETE',
  };
  return await API(obj);
};