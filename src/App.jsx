import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Saved from "./pages/Saved";
import { SavedCompanyProvider } from "./context/SavedCompanyContext";

export default function App() {
  return (
    <SavedCompanyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="saved" element={<Saved />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SavedCompanyProvider>
  );
}
