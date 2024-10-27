import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user-info"))
  );

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const userLogout = () => {
    setUser(null);
  };

  const userLogin = (user) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ updateUser, userLogout, userLogin, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
