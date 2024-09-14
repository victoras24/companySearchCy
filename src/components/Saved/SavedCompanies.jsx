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

export default function SavedCompanies() {
  const { savedCompanies, setSavedCompanies } = useCompanyContext();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = savedCompanies.findIndex(
        (item) => item.entry_id === active.id
      );
      const newIndex = savedCompanies.findIndex(
        (item) => item.entry_id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newArray = arrayMove(savedCompanies, oldIndex, newIndex);
        setSavedCompanies(newArray);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={savedCompanies.map((company) => company.entry_id)}
      >
        <div className="saved-companies">
          {savedCompanies.map((company) => (
            <Sortable id={company.entry_id} key={company.entry_id}>
              <div className="saved-company-container">
                <h3>{company.organisation_name}</h3>
              </div>
            </Sortable>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
