import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface IconComponent {
  symbol: IconDefinition;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  style?: string;
  reference?: (instance: SVGSVGElement | null) => void;
}

export const Icon: React.FC<IconComponent> = ({
  symbol,
  style,
  onClick,
  reference,
}) => {
  return (
    <FontAwesomeIcon
      icon={symbol}
      className={style}
      onClick={onClick}
      ref={reference}
    />
  );
};
