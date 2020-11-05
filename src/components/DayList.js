import React from "react";
import DayListItem from "components/DayListItem";
import "./styles/DayListItem.scss";

export default function DayList(props) {
  const dayListItem = props.days.map((item) => {
    return (
      <DayListItem
        key={item.id}
        testid={item.id}
        name={item.name}
        spots={item.spots}
        selected={item.name === props.day}
        setDay={props.setDay}
      />
    );
  });
  return <ul>{dayListItem}</ul>;
}
