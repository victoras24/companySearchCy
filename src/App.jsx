import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Organizer from "./pages/Organizer";
import Account from "./pages/Account";
import { SavedCompanyProvider } from "./context/SavedCompanyContext";
import { CompanyDataProvider } from "./context/CompanyDataContext";

export default function App() {
  return (
    <CompanyDataProvider>
      <SavedCompanyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="search/:companyId" element={<CompanyDetailPage />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="organizer" element={<Organizer />} />
              <Route path="account" element={<Account />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SavedCompanyProvider>
    </CompanyDataProvider>
  );
}
