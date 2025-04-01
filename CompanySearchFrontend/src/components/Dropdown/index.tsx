import React from "react";

interface DropdownProps {
  id: string;
  content: string[];
  style?: string;
  label: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  content,
  id,
  style,
  label,
}) => {
  return (
    <div className="dropdown">
      <label style={{ marginRight: "1rem" }}>{label}</label>
      <select className={style} name={id} id={id}>
        {content.map((c: string) => {
          return <option value={c.split(" ").join()}>{c}</option>;
        })}
      </select>
    </div>
  );
};
