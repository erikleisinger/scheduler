import React, { useEffect, useState } from "react";
import "./styles/DayListItem.scss";

const classNames = require("classnames");

export default function DayListItem(props) {
  // formatting message for # of spots remaining

  const [spots, setSpots] = useState(props.spots);

  useEffect(() => {
    setSpots(props.spots);
  });

  let num =
    props.spots === 1
      ? "1 spot"
      : props.spots === 2
      ? "2 spots"
      : props.spots === 3
      ? "3 spots"
      : props.spots === 4
      ? "4 spots"
      : props.spots === 5
      ? "5 spots"
      : "no spots";
  num += " remaining";

  // CSS class
  let dayClass = classNames({
    "day-list__item": true,
  });

  if (props.spots === 0) {
    dayClass += " --full";
  } else if (props.selected) {
    dayClass += " --selected";
  }

  // render DOM nodes
  return (
    <li
      className={dayClass}
      onClick={() => props.setDay(props.name)}
      data-testid={props.name}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{num}</h3>
    </li>
  );
}
