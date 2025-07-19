import React, { useState } from "react";
import './CategoriaCard.css';

interface CategoriaProps {
  cat: any;
  isActive: boolean;
  onClick: (producto: any) => void;
}

const CategoriaCard: React.FC<CategoriaProps> = ({ cat, onClick, isActive }) => {
  return (
    <div
      className={`categoria fadeInDown ${isActive ? 'activa' : ''}`}
      onClick={() => onClick(cat)}
    >
      {cat.nombre}
    </div>
  );
};

export default CategoriaCard;