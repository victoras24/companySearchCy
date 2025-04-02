import React from "react";
import { Icon } from "../Icon";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import { Dropdown } from "../Dropdown";

interface FilterProps {
  isFilterOpen: boolean;
  selectFilter: (event) => void;
  closeFilter: () => void;
  selectedFilter: number;
  selectedOption: (e: any) => void;
  officials: boolean;
}
const dropdownContent = ["Organisation", "Officials"];
export const Filter: React.FC<FilterProps> = ({
  isFilterOpen,
  closeFilter,
  selectFilter,
  selectedFilter,
  selectedOption,
  officials,
}) => {
  return (
    isFilterOpen && (
      <div className="filter mt-4 p-3 rounded">
        <div className="filter__title d-flex justify-content-between">
          <Dropdown
            id="filter"
            content={dropdownContent}
            style="bg-transparent rounded p-1"
            label="Filter by:"
            selectedOption={selectedOption}
          />
          <Icon
            onClick={closeFilter}
            symbol={faX}
            size="sm"
            style="filter__icon"
          />
        </div>
        {!officials && (
          <div className="mt-3 d-flex justify-content-between">
            <Button
              onClick={selectFilter}
              content="Active"
              variant={selectedFilter == 1 ? "selectedActive" : "active"}
              size={"sm"}
              id="1"
            />
            <Button
              onClick={selectFilter}
              content="Inactive"
              variant={selectedFilter == 2 ? "selectedInactive" : "inactive"}
              size={"sm"}
              id="2"
            />
            <Button
              onClick={selectFilter}
              content="All"
              variant={selectedFilter == 3 ? "selectedDefault" : "default"}
              size={"sm"}
              id="3"
            />
          </div>
        )}
      </div>
    )
  );
};
