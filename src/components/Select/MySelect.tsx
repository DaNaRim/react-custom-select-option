import React, { type ReactElement, useCallback, useEffect, useState } from "react";
import styles from "./CustomSelect.module.scss";
import Button from "./extensions/Button/Button";
import Option, { type OptionProps } from "./extensions/Option/Option";

// Necessary props for Select extensions
export interface SelectExtensionProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

interface SelectExtension { // Extension components to use with dot notation
    Option: typeof Option;
    Button: typeof Button;
}

interface SelectProps {
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode | React.ReactNode[];
}

const MySelect: React.FC<SelectProps> & SelectExtension = ({
                                                             value,
                                                             onChange,
                                                             children,
                                                         }: SelectProps) => {
    const [selectedOption, setSelectedOption]
        = useState<ReactElement<OptionProps> | null>(null);

    const [preparedChildren, setPreparedChildren]
        = useState<Array<ReactElement<SelectExtensionProps>>>([]);

    const [isOptionListVisible, setIsOptionListVisible] = useState(false);

    // Initial changes to children list to set up properties for Extensions
    const initChildrenOptions = () => getChildrenReactElementArray()
        .forEach(child => {
            if (child.type === Option) {
                child.props.onClick = (e: React.ChangeEvent<HTMLSelectElement>) => {
                    onChange(e); // Call onChange from Select parent
                };
            }
        });

    // Handles option list after selected change
    const prepareOptions = () => getChildrenReactElementArray()
        .map(child => React.cloneElement(child, {
            isSelected: child.props.value === value,
        }));

    // Handles option that will be displayed in the Select main block
    const prepareSelectedDisplayOption = () => {
        let newSelectedOption: ReactElement<OptionProps> | null = null;

        preparedChildren.forEach(child => {
            if (child.type === Option) {
                const castedChild = child as ReactElement<OptionProps>;
                if (castedChild.props.value === value) {
                    newSelectedOption = React.cloneElement(castedChild, {
                        // Remove dropdown styles and prevent OnChange from firing
                        isInDropdown: false,
                    });
                }
            }
        });
        return newSelectedOption;
    };

    // Returns array of children which are React.ReactElement
    const getChildrenReactElementArray = useCallback((): ReactElement[] => {
        const flat = [];
        if (Array.isArray(children)) {
            flat.push(...children.flat());
        } else {
            flat.push(children);
        }
        const elementArray: ReactElement[] = [];

        flat?.forEach(flat0 => {
            if (React.isValidElement(flat0)) {
                elementArray.push(flat0);
            }
        });
        return elementArray;
    }, [children]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === " ") { // Space
            setIsOptionListVisible(!isOptionListVisible);
        }
    };

    useEffect(() => {
        setSelectedOption(prepareSelectedDisplayOption());
    }, [value, preparedChildren]);

    useEffect(() => {
        if (children == null || (children as []).length < 1) {
            return;
        }
        initChildrenOptions();
    }, [children, onChange]);

    useEffect(() => {
        if (children == null || (children as []).length < 1) {
            return;
        }
        setPreparedChildren(prepareOptions());
    }, [children, value]);

    return (
        <div className={styles.customSelect}
             onClick={() => setIsOptionListVisible(!isOptionListVisible)}
             onBlur={e => e.relatedTarget === null && setIsOptionListVisible(false)}
             onKeyDown={e => handleKeyDown(e)}
             tabIndex={0}
        >
            <div className={styles.input}>
                {selectedOption}
            </div>
            <div className={`${styles.options}
                ${isOptionListVisible ? styles.optionsVisible : ""}`}>

                {preparedChildren}
            </div>
        </div>
    );
};

MySelect.Option = Option;
MySelect.Button = Button;

export default MySelect;
