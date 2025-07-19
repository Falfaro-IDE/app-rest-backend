import React, { useEffect, useState } from "react";
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonText } from "@ionic/react";
import './CustomInput.css';
import { eye,eyeOffOutline, lockClosed } from 'ionicons/icons';

interface CustomInputProps {
  label: string;
  type?: "text" | "password" | "email" | "number";
  value?: string;
  onIonChange?: (e: CustomEvent) => void;
  onValidate?: (isValid: boolean) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  onClick?: () => void;
  labelPlacement?: any;
  customValidation?: (value: string) => boolean;
  editable?: boolean;
  cantidadMaxLenght?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type = "text",
  value = "",
  onIonChange,
  onValidate,
  placeholder,
  required = false,
  className = "",
  onClick,
  customValidation,
  labelPlacement,
  editable,
  cantidadMaxLenght
}) => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false); 

  const defaultValidations: Record<string, (value: string) => boolean> = {
    number: (value) => /^[0-9]+$/.test(value) || value === "",
    text: (value) => /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,()\/\-_'":;@!?¿¡&%$#=+*]*$/.test(value) || value === "",
    email: (value) => /^[a-zA-Z0-9ñÑ._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || value === "",
    password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/-]{8,}$/.test(value) || value === "",
  };

  // Mensajes de error predeterminados
  const errorMessages: Record<string, string> = {
    number: "Solo se permiten números.",
    text: "Solo se permiten letras y números.",
    email: "Ingrese un correo válido.",
    password: "Ingrese mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.",
  };

  // Manejar cambio de input y validar
  const validateInput = (inputValue: string) => {

    let isValidInput = true;
    let message = "";

    // Si hay validación personalizada, se usa esa
    if (customValidation) {
      isValidInput = customValidation(inputValue);
      message = isValidInput ? "" : "Formato inválido.";
    } else if (defaultValidations[type]) {
      // Sino, se usa la validación por defecto
      isValidInput = defaultValidations[type](inputValue);
      message = isValidInput ? "" : errorMessages[type];
    }

    setIsValid(isValidInput);
    setErrorMessage(message);

    if (onValidate) {
      onValidate(isValidInput); // ✅ Notificamos al componente padre
    }
  };

  const handleChange = (e: CustomEvent) => {
    const inputValue = e.detail.value as string;;
    // Primero, actualizamos el valor en el componente padre
    if (onIonChange) {
      onIonChange(e);
    }
  
    // Luego, validamos el valor ingresado
    validateInput(inputValue);
    setIsFocused(!!e.detail.value);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(!!value); // 🔹 Retrasa la eliminación para evitar errores del DOM
    }, 100);
  };

  useEffect(() => {
    if (value !== undefined) {
      validateInput(value);
      setIsFocused(!!value);
    }
  }, [value]);
  

  return (
    <div style={{width: '100%'}} className="input-principal" >
      <div style={{width: '100%'}} >
      <IonInput
        className={`${className} ${isValid ? className : "invalid-input"}`}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        value={value}
        label={label}
        labelPlacement={labelPlacement}
        onIonInput={handleChange}
        onClick={onClick}
        onIonFocus={handleFocus} // 🔹 Cuando el input obtiene foco, muestra el icono
        onIonBlur={handleBlur} 
        placeholder={placeholder}
        required={required}
        clearInput={false}
        clearOnEdit={false}
        disabled={editable}
        maxlength={cantidadMaxLenght}
      >
      </IonInput>
      {!isValid && <IonText className="ion-texts" color="danger">{errorMessage}</IonText>}
      </div>
      <div>
      {type === "password" &&  (
          <IonButton
            fill="clear"
            slot="end"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Mostrar/Ocultar contraseña"
          >
            <IonIcon slot="icon-only" icon={showPassword ? eyeOffOutline : eye} />
          </IonButton>
        )}
      </div>

    </div>

  );
};

export default CustomInput;