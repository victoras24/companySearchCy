import React from "react";

interface DragDropProps {
	children: any;
	items: any[];
	setItems: any;
	id: any;
}

const DragDrop: React.FC<DragDropProps> = ({
	children,
	items,
	setItems,
	id,
}) => {
	const handleDragStart = (e) => {
		e.dataTransfer.setData("text/plain", id);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	};

	const handleDrop = (e) => {
		e.preventDefault();
		let updatedItems = [...items];
		const draggedId = e.dataTransfer.getData("text/plain");
		const droppedAreaId = e.currentTarget.id;

		const draggedItemIndex = items.findIndex((item) => {
			return item.id.toString() == draggedId.toString();
		});
		const droppedItemIndex = items.findIndex((item) => {
			return item.id.toString() == droppedAreaId.toString();
		});

		const draggedItem = items[draggedItemIndex];
		updatedItems.splice(draggedItemIndex, 1);
		updatedItems.splice(droppedItemIndex, 0, draggedItem);
		setItems(updatedItems);
	};

	return (
		<div
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
			draggable
			id={id}
		>
			{children}
		</div>
	);
};

export default DragDrop;
