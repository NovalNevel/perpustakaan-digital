import auth from './auth';

const fetchWithAuth = async (url, options = {}) => {
  let accessToken = sessionStorage.getItem('accessToken');
  let headers = { ...options.headers, Authorization: `Bearer ${accessToken}` };

  let response = await fetch(url, { ...options, headers });

  // Cek 401 atau 403
  if (response.status === 401 || response.status === 403) {
    console.log('[fetchWithAuth] Token expired or forbidden, trying to refresh token...');
    try {
      const data = await auth().refreshToken();
      console.log('[fetchWithAuth] Refresh token success:', data);
      accessToken = data.accessToken;
      headers.Authorization = `Bearer ${accessToken}`;
      // Retry request
      response = await fetch(url, { ...options, headers });
    } catch (err) {
      console.error('[fetchWithAuth] Refresh token failed:', err);
      window.location.href = '/login';
      throw err;
    }
  }

  return response;
};

export default fetchWithAuth;