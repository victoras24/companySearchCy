import React from "react";

interface DropdownProps {
  id: string;
  content: string[];
  style?: string;
  label: string;
  selectedOption: string;
  onOptionSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  content,
  id,
  style,
  label,
  selectedOption,
  onOptionSelect,
}) => {
  return (
    <div className="dropdown">
      <label style={{ marginRight: "1rem" }}>{label}</label>
      <select
        onChange={(e) => onOptionSelect(e)}
        value={selectedOption}
        className={style}
        name={id}
        id={id}
      >
        {content.map((c: string, i: number) => {
          return (
            <option key={i} value={c}>
              {c}
            </option>
          );
        })}
      </select>
    </div>
  );
};
