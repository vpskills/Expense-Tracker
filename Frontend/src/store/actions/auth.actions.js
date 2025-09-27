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

export const getCurrentUser = async () => {
  const obj = {
    url: `${AuthEndPoints.GetUser}`,
    method: 'GET',
  };
  return await API(obj);
};

export const googleLoginAction = async ({ credential }) => {
  const obj = {
    url: `${AuthEndPoints.GoogleAuth}`,
    method: "POST",
    body: JSON.stringify({ credential }),
  };
  return await API(obj);
};
