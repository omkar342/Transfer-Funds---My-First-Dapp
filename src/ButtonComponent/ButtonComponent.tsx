import React from "react";
import "./ButtonComponent.css";

const ButtonComponent: React.FC<{
  title: string;
  handleOnClick: () => void;
}> = ({ title, handleOnClick }) => {
  return (
    <div className="button_component">
      <button
        onClick={handleOnClick}
        style={
          title === "Withdraw"
            ? {
                backgroundColor: "#fff",
                color: "#000",
              }
            : {}
        }
        className="button"
      >
        {title}
      </button>
    </div>
  );
};

export default ButtonComponent;
