import React from "react";
import { IonButton } from "@ionic/react";

interface CustomButtonProps {
  text: string;
  color?: string;
  expand?: any;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  color = "primary",
  expand = "full",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <IonButton color={color} expand={expand} onClick={onClick} disabled={disabled} className={className}>
      {text}
    </IonButton>
  );
};

export default CustomButton;