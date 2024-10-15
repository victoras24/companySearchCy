import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Organizer from "./pages/Organizer";
import { SavedCompanyProvider } from "./context/SavedCompanyContext";

export default function App() {
  return (
    <SavedCompanyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="search/:companyId" element={<CompanyDetailPage />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="organizer" element={<Organizer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SavedCompanyProvider>
  );
}
