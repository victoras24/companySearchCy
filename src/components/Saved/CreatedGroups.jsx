import { useCallback } from "react";
import { useCompanyContext } from "../../context/SavedCompanyContext";
import Sortable from "../../utils/Sortable";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

export default function CreatedGroups() {
  const { groups, setGroups } = useCompanyContext();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event, data, setData, idKey = "id") => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = data.findIndex((item) => item[idKey] === active.id);
      const newIndex = data.findIndex((item) => item[idKey] === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newArray = arrayMove(data, oldIndex, newIndex);
        setData(newArray);
      }
    }
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        handleDragEnd(event, groups, setGroups, "id");
      }}
    >
      <SortableContext items={groups}>
        <div className="groups-container">
          {groups.map((group) => (
            <Sortable id={group.id} key={group.id}>
              <div className="group-wrapper">
                <h3>{group.name}</h3>
              </div>
            </Sortable>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
