import React from "react";
import { firestore } from "../../Firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthStoreContext";

interface DragDropProps {
	children: React.ReactNode;
	items: any[];
	setItems: React.Dispatch<React.SetStateAction<any[]>>;
	id?: string;
	groupId?: string;
	secondary?: boolean;
	secondaryId?: string;
}

const DragDrop: React.FC<DragDropProps> = ({
	children,
	items,
	setItems,
	id,
	groupId,
	secondary,
	secondaryId,
}) => {
	const { user } = useAuth();
	const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		if (secondary) {
			e.dataTransfer.setData(
				"application/json",
				JSON.stringify({
					type: "company",
					companyId: secondaryId,
					sourceGroupId: groupId,
				})
			);
		} else if (id) {
			e.dataTransfer.setData(
				"application/json",
				JSON.stringify({
					type: "group",
					groupId: id,
				})
			);
		}
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		const userRef = doc(firestore, "users", user.uid);

		e.preventDefault();
		const data = JSON.parse(e.dataTransfer.getData("application/json"));

		if (data.type === "group") {
			const draggedId = data.groupId;
			const droppedAreaId = id;

			const draggedItemIndex = items.findIndex((item) => item.id === draggedId);
			const droppedItemIndex = items.findIndex(
				(item) => item.id === droppedAreaId
			);

			if (draggedItemIndex === -1 || droppedItemIndex === -1) return;

			const updatedItems = [...items];
			const [draggedItem] = updatedItems.splice(draggedItemIndex, 1);
			updatedItems.splice(droppedItemIndex, 0, draggedItem);
			setItems(updatedItems);
		} else if (data.type === "company") {
			const { companyId, sourceGroupId } = data;
			const targetGroupId = groupId;

			if (sourceGroupId === targetGroupId) return;

			const updatedItems = [...items];
			const sourceGroup = updatedItems.find((g) => g.id === sourceGroupId);
			const targetGroup = updatedItems.find((g) => g.id === targetGroupId);

			if (!sourceGroup || !targetGroup) return;

			const companyExistsInTarget = targetGroup.companies.some(
				(c) => c.id === companyId
			);
			if (companyExistsInTarget) return;

			const company = sourceGroup.companies.find((c) => c.id === companyId);
			if (!company) return;

			sourceGroup.companies = sourceGroup.companies.filter(
				(c) => c.id !== companyId
			);
			targetGroup.companies.push(company);

			console.log(updatedItems);

			setItems(updatedItems);
			await updateDoc(userRef, { groups: updatedItems });
		}
	};

	return (
		<div
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			draggable
			id={id}
			className="drag-drop-container"
		>
			{children}
		</div>
	);
};

export default DragDrop;
