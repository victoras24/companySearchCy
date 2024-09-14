import { useDroppable } from "@dnd-kit/core";

function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div className="group-wrapper" ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

export default Droppable;
