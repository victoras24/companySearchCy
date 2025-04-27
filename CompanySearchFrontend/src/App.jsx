import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search/Search_view";
import Layout from "./components/Layout";
import { Home } from "./pages/Home";
import Favorites from "./pages/Favorites/Favorites_view";
import Organiser from "./pages/Organiser/Organiser_view";
import Account from "./pages/Account";
import AccountDetails from "./pages/AccountDetails";
import { SavedCompanyProvider } from "./context/SavedCompanyContext";
import { AuthProvider, useAuth } from "./context/AuthStoreContext";
import OrganisationDetails from "./pages/OrganisationDetails/OrganisationDetails_view";

export default function App() {
	return (
		<AuthProvider>
			<SavedCompanyProvider>
				<AppRoutes />
			</SavedCompanyProvider>
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
					<Route path="search/:companyId" element={<OrganisationDetails />} />
					<Route
						path="favorites"
						element={user ? <Favorites /> : <Account />}
					/>
					<Route
						path="organiser"
						element={user ? <Organiser /> : <Account />}
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
