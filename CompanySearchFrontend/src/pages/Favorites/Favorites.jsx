import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCompanyContext } from "../../context/SavedCompanyContext";
import { faSquareMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthStoreContext";
import { doc, updateDoc, arrayRemove, collection } from "firebase/firestore";
import { firestore } from "../../Firebase/firebase";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { FavoritesModel } from "./Favorites_model";

export default function Favorites() {
	const [model] = useState(() => new FavoritesModel());
	const { user, updateUser } = useAuth();
	const [openGroup, setOpenGroup] = useState({});
	const plusBtnRefs = useRef({});
	const groupListRefs = useRef({});
	const navigate = useNavigate();
	const groupRef = collection(firestore, "users", user.uid, "groups");

	useEffect(() => {
		model.onMount();
	}, []);

	const deleteCompany = async (companyWeWantToDelete) => {
		try {
			const userRef = doc(firestore, "users", user.uid);

			await updateDoc(userRef, {
				savedCompanies: arrayRemove(companyWeWantToDelete),
			});

			updateUser({
				...user,
				savedCompanies: user.savedCompanies.filter(
					(company) => company !== companyWeWantToDelete
				),
			});

			localStorage.setItem(
				"user-info",
				JSON.stringify({
					...user,
					savedCompanies: user.savedCompanies.filter(
						(company) => company !== company
					),
				})
			);
		} catch (error) {}
	};

	useEffect(() => {
		function closeAddToGroup(e) {
			Object.keys(openGroup).forEach((id) => {
				if (
					openGroup[id] &&
					plusBtnRefs.current[id] &&
					!plusBtnRefs.current[id].contains(e.target) &&
					groupListRefs.current[id] &&
					!groupListRefs.current[id].contains(e.target)
				) {
					setOpenGroup((prevState) => {
						return {
							...prevState,
							[id]: false,
						};
					});
				}
			});
		}

		document.body.addEventListener("click", closeAddToGroup);
		return () => {
			document.body.removeEventListener("click", closeAddToGroup);
		};
	}, [openGroup]);

	const handleOpenGroup = useCallback((id) => {
		setOpenGroup((prevState) => {
			const newState = {
				...prevState,
				[id]: !prevState[id],
			};
			return newState;
		});
	}, []);

	const renderGroupList = (company, isGroupOpen) => {
		if (!isGroupOpen) return null;

		return (
			<div
				className="result-container-group-list"
				ref={(el) => (groupListRefs.current[company.id] = el)}
			>
				{model.groups.length > 0 ? (
					<ul style={{ listStyle: "none", padding: 0 }}>
						{model.groups.map((group) => (
							<li
								key={group.id}
								onClick={() =>
									model.addCompanyInGroup(
										groupRef,
										company.organisationName,
										group.id,
										user.uid
									)
								}
								style={{ cursor: "pointer", padding: "5px" }}
							>
								{group.name}
							</li>
						))}
					</ul>
				) : (
					<div>
						<p>No groups have been created yet.</p>
						<Button
							content="Create group"
							onClick={() => navigate("/organizer")}
						/>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="saved-page">
			<h1 className="saved-title">Favorites</h1>
			<p className="saved-description">
				View and manage all your marked favorite companies in one place. Easily
				add, remove, or explore details about your top choices.
			</p>

			<div className="saved-companies">
				<h2>Saved Companies</h2>
				{user.savedCompanies.length > 0 ? (
					user.savedCompanies.map((company) => {
						const isGroupOpen = openGroup[company.id];
						return (
							<div
								className="saved-company-container"
								style={{ position: "relative" }}
								key={company.id}
							>
								<span>{company.organisationName}</span>
								<div className="saved-company-icons">
									<Icon
										style="text-lg p-2"
										symbol={faCirclePlus}
										onClick={(e) => {
											e.stopPropagation();
											handleOpenGroup(company.id);
										}}
										reference={(el) => (plusBtnRefs.current[company.id] = el)}
									/>
									{renderGroupList(company, isGroupOpen)}
									<Icon
										style="text-lg p-2"
										symbol={faSquareMinus}
										onClick={() => deleteCompany(company)}
									/>
								</div>
							</div>
						);
					})
				) : (
					<span className="saved-companies-empty">
						No companies in favorites yet.
					</span>
				)}
			</div>
		</div>
	);
}
