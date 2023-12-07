import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import "./dropdown.css";
import { BsCheck2 } from "react-icons/bs";
import { IoMdGrid } from "react-icons/io";
import { MdPreview } from "react-icons/md";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface DropDownProps {
  placeHolder: React.ReactNode;
  options: Option[];
  isMulti?: boolean;
  isSearchable?: boolean;
  align?: string;
  onChange: (value: Option | Option[]) => void;
}

const Icon = ({ isOpen }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      stroke="#222"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={isOpen ? "translate" : ""}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
};

// CloseIcon component
const CloseIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      stroke="#fff"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
};

const DropDown: React.FC<DropDownProps> = ({
  placeHolder,
  options,
  isMulti,
  isSearchable,
  onChange,
  align,
}) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<Option[] | Option | null>(
    isMulti ? [] : null
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchValue("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  const handleInputClick = () => {
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (
      !selectedValue ||
      (isMulti && (selectedValue as Option[]).length === 0)
    ) {
      return placeHolder;
    }
    if (isMulti) {
      return (
        <div className="dropdown-tags">
          {(selectedValue as Option[]).map((option, index) => (
            <div key={`${option.value}-${index}`} className="dropdown-tag-item">
              {option.label}
              <span
                onClick={(e) => onTagRemove(e, option)}
                className="dropdown-tag-close"
              >
                <CloseIcon />
              </span>
            </div>
          ))}
        </div>
      );
    }
    return (selectedValue as Option).label;
  };

  const removeOption = (option: Option) => {
    return (selectedValue as Option[]).filter((o) => o.value !== option.value);
  };

  const onTagRemove = (e: React.MouseEvent, option: Option) => {
    e.stopPropagation();
    const newValue = removeOption(option);
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const onItemClick = (option: Option) => {
    let newValue;
    if (isMulti) {
      if (
        (selectedValue as Option[]).findIndex(
          (o) => o.value === option.value
        ) >= 0
      ) {
        newValue = removeOption(option);
      } else {
        newValue = [...(selectedValue as Option[]), option];
      }
    } else {
      newValue = option;
    }
    console.log("newValue: ", newValue);
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const isSelected = (option: Option) => {
    if (isMulti) {
      return (
        (selectedValue as Option[]).filter((o) => o.value === option.value)
          .length > 0
      );
    }

    if (!selectedValue) {
      return false;
    }

    return (selectedValue as Option).value === option.value;
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const getOptions = () => {
    if (!searchValue) {
      return options;
    }

    return options.filter(
      (option) =>
        option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    );
  };

  return (
    <div className="custom--dropdown-container">
      <div ref={inputRef} onClick={handleInputClick} className="dropdown-input">
        <div
          className={`dropdown-selected-value ${
            !selectedValue ||
            (isMulti && (selectedValue as Option[]).length === 0)
              ? "placeholder"
              : ""
          }`}
        >
          {getDisplay() === "Grid mode" || getDisplay() === "Preview mode" ? (
            getDisplay() =="Grid mode" ?
            <IoMdGrid />: <MdPreview/>
          ) : (
            getDisplay()
          )}
        </div>
        <div className="dropdown-tools">
          <div className="dropdown-tool">
            <Icon isOpen={showMenu} />
          </div>
        </div>
      </div>

      {showMenu && (
        <div className={`dropdown-menu alignment--${align || "auto"}`}>
          {isSearchable && (
            <div className="search-box">
              <input
                className="form-control"
                onChange={onSearch}
                value={searchValue}
                ref={searchRef}
              />
            </div>
          )}
          {getOptions().map((option) => (
            <div
              onClick={() => onItemClick(option)}
              key={option.value}
              className={`dropdown-item ${isSelected(option) && "selected"}`}
            >
              {isSelected(option) && placeHolder === "View" ? <BsCheck2 /> : ""}
              {option.label}
              {option.value === "grid" ? <IoMdGrid /> : ""}
              {option.value === "preview" ? <MdPreview /> : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
