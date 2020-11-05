import React from "react";
import "./styles/InterviewerListItem.scss";

const classNames = require("classnames");

export default function InterviewerListItem(props) {
  let listClass = classNames({
    interviewers__item: true,
    "--selected": props.selected,
    "-image": props.avatar,
  });

  return (
    <li
      className={listClass}
      onClick={props.setInterviewer}
      data-testid={props.testid}
      key={props.testid}
    >
      <img className={listClass} src={props.avatar} alt={props.name} />
      {props.selected && props.name}
    </li>
  );
}
