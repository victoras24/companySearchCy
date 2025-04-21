import { useState } from "react";
import { Icon } from "../../components/Icon";
import {
	faSquareMinus,
	faAngleDown,
	faAngleUp,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/Button";
import { OrganizerModel } from "./Organizer_model";
import React from "react";
import { observer } from "mobx-react";

const Organizer: React.FC = observer(() => {
	const [model, setModel] = useState(() => new OrganizerModel());

	return (
		<div className="organizer-page">
			<h1 className="saved-title">Company organizer</h1>
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
						<Button onClick={model.createGroup} content="Create group" />
					</motion.div>
				}
			</AnimatePresence>
			<div>
				<div className="groups-container">
					{model.groups.map((group) => (
						<div key={group.id} className="group-wrapper">
							<div className="group-wrapper-top-section">
								<h2>{group.name}</h2>
								<div>
									<Button
										icon={group.isExtended ? faAngleUp : faAngleDown}
										variant={"icon"}
									/>
									<Button icon={faTrashCan} className="p-0" variant={"icon"} />
								</div>
							</div>
							{group.isExtended && (
								<ul>
									{group.companies.map((comp) => (
										<div className="grouped-companies" key={comp.id}>
											<li draggable>{comp.organisationName}</li>
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
		</div>
	);
});

export default Organizer;
