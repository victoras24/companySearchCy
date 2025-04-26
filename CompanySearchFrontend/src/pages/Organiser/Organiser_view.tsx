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
import { organiserModel } from "./Organiser_model";
import React from "react";
import { observer } from "mobx-react";
import { firestore } from "../../Firebase/firebase";
import { doc } from "firebase/firestore";
import { useAuth } from "../../context/AuthStoreContext";

const organiser: React.FC = observer(() => {
	const [model] = useState(() => new organiserModel());
	const { user } = useAuth();
	const groupRef = doc(firestore, "users", user.uid);

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
							onClick={() => model.createGroup(groupRef)}
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
											icon={model.isGroupExtended ? faAngleUp : faAngleDown}
											onClick={() =>
												model.setGroupExtended(!model.isGroupExtended)
											}
											variant={"icon"}
										/>
										<Button
											icon={faTrashCan}
											className="p-0"
											variant={"icon"}
											onClick={() => model.deleteGroup(groupRef, group)}
										/>
									</div>
								</div>
								{model.isGroupExtended && (
									<ul>
										{model.groups.map((group) => (
											<div className="grouped-companies" key={group.id}>
												<ul>
													{group.companies.map((company, index) => (
														<li key={index}>{company}</li>
													))}
												</ul>
												<Icon
													symbol={faSquareMinus}
													style="saved-company-delete"
												/>
											</div>
										))}
									</ul>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
});

export default organiser;
