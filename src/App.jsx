import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import Layout from "./components/Layout";
import { Home } from "./pages/Home";
import Favorites from "./pages/Favorites";
import Organizer from "./pages/Organizer";
import Account from "./pages/Account";
import AccountDetails from "./pages/AccountDetails";
import { SavedCompanyProvider } from "./context/SavedCompanyContext";
import { CompanyDataProvider } from "./context/CompanyDataContext";
import { AuthProvider, useAuth } from "./context/AuthStoreContext";

export default function App() {
  return (
    <AuthProvider>
      <CompanyDataProvider>
        <SavedCompanyProvider>
          <AppRoutes />
        </SavedCompanyProvider>
      </CompanyDataProvider>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="search/:companyId" element={<CompanyDetailPage />} />
          <Route
            path="favorites"
            element={user ? <Favorites /> : <Account />}
          />
          <Route
            path="organizer"
            element={user ? <Organizer /> : <Account />}
          />
          <Route
            path="account"
            element={user ? <AccountDetails /> : <Account />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
