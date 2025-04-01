import React from "react";
import { Icon } from "../Icon";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import { Dropdown } from "../Dropdown";

const dropdownContent = ["Organisation", "Officials"];

export const Filter: React.FC = () => {
  return (
    <div className="filter mt-4 p-3 rounded">
      <div className="filter__title d-flex justify-content-between">
        <Dropdown
          id="filter"
          content={dropdownContent}
          style="bg-transparent rounded p-1"
          label="Filter by:"
        />
        <Icon symbol={faX} size="sm" style="filter__icon" />
      </div>
      <div className="justify-content-center"></div>
      <div className="mt-3 d-flex justify-content-between">
        <Button content="Active" variant={"active"} size={"sm"} />
        <Button content="Inactive" variant={"inactive"} size={"sm"} />
        <Button content="All" variant={"default"} size={"sm"} />
      </div>
    </div>
  );
};
