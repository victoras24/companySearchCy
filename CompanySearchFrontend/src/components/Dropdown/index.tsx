import React from "react";

interface DropdownProps {
  id: string;
  content: string[];
  style?: string;
  label: string;
  selectedOption: (e: any) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  content,
  id,
  style,
  label,
  selectedOption,
}) => {
  return (
    <div className="dropdown">
      <label style={{ marginRight: "1rem" }}>{label}</label>
      <select
        onChange={(e) => selectedOption(e)}
        className={style}
        name={id}
        id={id}
      >
        {content.map((c: string, i: number) => {
          return (
            <option key={i} value={c.split(" ").join()}>
              {c}
            </option>
          );
        })}
      </select>
    </div>
  );
};
