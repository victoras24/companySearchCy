import { useEffect, useState } from "react";
import { Icon } from "../../components/Icon";
import {
	faSquareMinus,
	faAngleDown,
	faAngleUp,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/Button";
import { OrganiserModel } from "./Organiser_model";
import React from "react";
import { observer } from "mobx-react";
import { firestore } from "../../Firebase/firebase";
import { doc } from "firebase/firestore";
import { useAuth } from "../../context/AuthStoreContext";

const Organiser: React.FC = observer(() => {
	const [model] = useState(() => new OrganiserModel());
	const { user } = useAuth();
	const docRef = doc(firestore, "users", user.uid);

	useEffect(() => {
		model.onMount();
	}, []);

	return (
		<div className="organiser-page">
			<h1 className="saved-title">Company organiser</h1>
			<p className="saved-description">
				Create and manage groups to efficiently organize your saved companies.
				Categorize your favorites for easy access and streamlined management.
			</p>
			<AnimatePresence>
				{
					<motion.div
						className="create-group-container"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.2 }}
					>
						<h2>Name group</h2>
						<input
							className="create-group-input"
							type="text"
							value={model.groupName}
							onChange={model.handleInputChange}
						/>
						<Button
							onClick={() => model.createGroup(docRef)}
							content="Create group"
						/>
					</motion.div>
				}
			</AnimatePresence>
			{model.isLoading ? (
				<p>Loading...</p>
			) : (
				<div>
					<div className="groups-container">
						{model.groups?.map((group) => (
							<div key={group.id} id={group.id} className="group-wrapper">
								<div className="group-wrapper-top-section">
									<h2>{group.name}</h2>
									<div id={group.id}>
										<Button
											icon={
												model.expandedGroups[group.id] ? faAngleUp : faAngleDown
											}
											onClick={() => model.extendGroup(group.id)}
											variant={"icon"}
											className="m-1"
										/>
										<Button
											icon={faTrashCan}
											className="p-0"
											variant={"icon"}
											onClick={() => model.deleteGroup(docRef, group)}
										/>
									</div>
								</div>
								{model.expandedGroups[group.id] && (
									<>
										<div className="grouped-companies" key={group.id}>
											{group.companies.map((company, index) => (
												<div
													key={index}
													className="d-flex align-items-center justify-content-between"
												>
													<li>{company.name}</li>
													<Icon
														symbol={faSquareMinus}
														style="saved-company-delete"
														onClick={() =>
															model.deleteCompanyAssignedInGroup(
																user.uid,
																company.id,
																group.id
															)
														}
													/>
												</div>
											))}
										</div>
									</>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
});

export default Organiser;
