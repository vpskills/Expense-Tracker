import API from '../common/api';
import { AuthEndPoints } from '../common/endpoints';

export const userLogin = async (body) => {
  const obj = {
    url: `${AuthEndPoints.Signin}`,
    method: 'POST',
    body: JSON.stringify(body),
  };
  return await API(obj);
};

export const userSignup = async (body) => {
  const obj = {
    url: `${AuthEndPoints.Signup}`,
    method: 'POST',
    body: JSON.stringify(body),
    isNoToken: true,
  };
  return await API(obj);
};

