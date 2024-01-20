import React from "react";
import DropDown from "../app-components/dropdown";
import { IoIosArrowRoundUp } from "react-icons/io";
import { useActions } from "../../hooks/use-actions";
import { useTypedSelector } from "../../hooks/use-typed-selector";
import { HiArrowLongDown, HiOutlineArrowLongUp } from "react-icons/hi2";

import "./project-list-sort.css";

const ProjectListSort = () => {
  const { updateProjectsSortBy, updateProjectsSortIn } = useActions();
  const projectsSortIn = useTypedSelector((state)=> state.projects.projectsSortIn)

  const options = [
    {
      label: "Name",
      value: "name",
    },
    {
      label: "Last Created",
      value: "lastCreated",
    },
  ];

  const handleProjectsSortInUp = () => {
    updateProjectsSortIn('decrease');
  };
  const handleProjectsSortInDown = () => {
    updateProjectsSortIn('increase');
  };

  const handleChangeSelect = (e) => {
    updateProjectsSortBy(e.value);
  };
  return (
    <div className="sort-by-in">
      <DropDown
        options={options}
        placeHolder={"Name"}
        onChange={(e) => handleChangeSelect(e)}
        align="center"
        // isSearchable
        // isMulti
      />
      { projectsSortIn === "increase" &&
        <span className="sort-in" onClick={handleProjectsSortInUp}>
          <HiOutlineArrowLongUp />
        </span>
      }
      { projectsSortIn === "decrease" &&
        <span className="sort-in" onClick={handleProjectsSortInDown}>
          <HiArrowLongDown />
        </span>
      }
    </div>
  );
};

export default ProjectListSort;
