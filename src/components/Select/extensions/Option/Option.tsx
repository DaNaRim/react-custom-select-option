import React from "react";
import { type SelectExtensionProps } from "../../MySelect";
import styles from "./Option.module.scss";

export interface OptionProps extends SelectExtensionProps {
    value: string | number; // Identifies option
    isSelected?: boolean; // Is the option selected? Handled automatically by Select parent el
    isInDropdown?: boolean; // Is the option in dropdown? Handled automatically by Select Parent el
}

const Option = ({
                    children,
                    // Function to call when the option is selected.
                    // Handled automatically by Select Parent el. Use Select.onChange instead
                    onClick,
                    value,
                    isSelected = false,
                    isInDropdown = true,
                }: OptionProps) => {
    const handleSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.KeyboardEvent<HTMLDivElement>) => {
        // If an option is not in dropdown, it is already selected
        // If an option is selected, it should not be selected again
        if (onClick == null || !isInDropdown || isSelected) {
            return;
        }
        const changedEvent = { ...e, target: { ...e.target, value } };
        onClick(changedEvent as React.MouseEvent<HTMLElement, MouseEvent>);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "Enter") {
            return;
        }
        handleSelect(e);
    };

    return (
        <div className={`${styles.option}
                         ${isInDropdown ? styles.in_dropdown : ""}
                         ${isSelected && isInDropdown ? styles.selected : ""}
                        `}
             onClick={handleSelect}
             onKeyDown={handleKeyDown}
            // If an option is in dropdown, it should be focusable
             {...(isInDropdown ? { tabIndex: 0 } : {})}
        >
            {children}
        </div>
    );
};

export default Option;
