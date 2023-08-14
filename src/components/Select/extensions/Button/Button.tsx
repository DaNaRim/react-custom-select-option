import React from "react";
import { type SelectExtensionProps } from "../../MySelect";
import styles from "./Button.module.scss";

interface ButtonProps extends SelectExtensionProps {
    className?: string; // For external styling
}

const Button = ({
                    children,
                    onClick,
                    className = "",
                }: ButtonProps) => {
    return (
        <button className={`${styles.select_button} ${className}`}
                onClick={onClick}
                tabIndex={0}
        >
            {children}
        </button>
    );
};

export default Button;
