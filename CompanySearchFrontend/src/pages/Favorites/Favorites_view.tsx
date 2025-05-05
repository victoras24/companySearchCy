import React, { useState, useEffect, useRef } from "react";
import { faSquareMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthStoreContext";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { FavoritesModel } from "./Favorites_model";
import { observer } from "mobx-react";
import { OrganiserModel } from "../Organiser/Organiser_model";
import DragDrop from "../../components/DragDrop/DragDrop";

const Favorites = observer(() => {
	const [model] = useState(() => new FavoritesModel());
	const [groupModel] = useState(() => new OrganiserModel());
	const { user } = useAuth();
	const [openGroup, setOpenGroup] = useState({});
	const plusBtnRefs = useRef({});
	const groupListRefs = useRef({});
	const navigate = useNavigate();

	useEffect(() => {
		model.onMount();
		groupModel.onMount();
	}, []);

	const handleOpenGroup = (id) => {
		setOpenGroup((prevState) => {
			const newState = {
				...prevState,
				[id]: !prevState[id],
			};
			return newState;
		});
	};

	const renderGroupList = (company, isGroupOpen) => {
		if (!isGroupOpen) return null;

		return (
			<div
				className="result-container-group-list"
				ref={(el) => (groupListRefs.current[company.id] = el)}
			>
				{groupModel.groups.length > 0 ? (
					<ul style={{ listStyle: "none", padding: 0 }}>
						{groupModel.groups.map((group) => (
							<li
								key={group.id}
								onClick={() =>
									model.addCompanyInGroup(company, user.uid, group.id)
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
							onClick={() => navigate("/organiser")}
						/>
					</div>
				)}
			</div>
		);
	};
	if (model.isLoading) return <p>Loading....</p>;
	return (
		<div className="saved-page">
			<h1 className="saved-title">Favorites</h1>
			<p className="saved-description">
				View and manage all your marked favorite companies in one place. Easily
				add, remove, or explore details about your top choices.
			</p>

			<div className="saved-companies">
				<h2>Saved Companies</h2>
				{model.favorites.length > 0 ? (
					model.favorites.map((company) => {
						const isGroupOpen = openGroup[company.id];
						return (
							<DragDrop
								items={model.favorites}
								setItems={model.setFavorite}
								key={company.id}
								id={company.id}
								secondary={false}
							>
								<div
									className="saved-company-container"
									style={{ position: "relative" }}
									id={company.id}
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
											onClick={() =>
												model.deleteCompanyFromFavorites(user, company)
											}
										/>
									</div>
								</div>
							</DragDrop>
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
});

export default Favorites;
