export default async function API({
  url,
  method = 'GET',
  body = '',
  isResponseJSON = true,
  isFormData = false,
  isNoToken = false,
  caching = false,
}) {
  let options = {
    method,
    headers: {
      Accept: 'application/json',
    },
  };

  if (!isNoToken) {
    options.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access');
  }

  if (body) {
    options.body = body;
  }

  if (!isFormData) {
    options.headers['content-type'] = 'application/json; charset=UTF-8';
  }

  if (caching) {
    options.headers['Cache-Control'] = 'public, max-age=86400';
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, options);

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Request failed');
  }

  if (isResponseJSON) {
    return await res.json();
  }

  return res;
}
