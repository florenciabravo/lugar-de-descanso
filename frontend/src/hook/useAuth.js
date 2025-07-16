export const useAuth = () => {
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      const token = data.token;

      localStorage.setItem('token', token);
      const payload = JSON.parse(atob(token.split('.')[1]));

      const id = payload.id;
      const username = payload.sub;

      return { id, username };
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
  };

  const getToken = () => localStorage.getItem('token');

  return { login, logout, getToken };
};
