import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface IconComponent {
  symbol: IconDefinition;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  className?: string;
}

export const Icon: React.FC<IconComponent> = ({
  symbol,
  className,
  onClick,
}) => {
  return (
    <FontAwesomeIcon icon={symbol} className={className} onClick={onClick} />
  );
};
