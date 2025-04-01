import { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface IconComponent {
  symbol: IconDefinition;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  style?: string;
  reference?: (instance: SVGSVGElement | null) => void;
  size?: SizeProp;
}

export const Icon: React.FC<IconComponent> = ({
  symbol,
  style,
  size,
  onClick,
  reference,
}) => {
  return (
    <FontAwesomeIcon
      icon={symbol}
      size={size}
      className={style}
      onClick={onClick}
      ref={reference}
    />
  );
};
