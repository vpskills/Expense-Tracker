import API from '../common/api';
import { CategoriesEndPoints } from '../common/endpoints';

export const fetchCategories = async ({ page = 1, limit = 10 }) => {
  const obj = {
    url: `${CategoriesEndPoints.GetCategories(page, limit)}`,
    method: 'GET',
    isNoToken: true
  };
  return await API(obj);
};
