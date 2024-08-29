import Search from "./components/Search"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import { BrowserRouter, Routes, Route } from "react-router-dom"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />} >
                    <Route index element={<Home />} />
                    <Route path="search" element={<Search />} />
                </Route >
            </Routes>
        </BrowserRouter>
    )
}