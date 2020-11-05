import React from "react";

import "./styles/Button.scss";

const classNames = require("classnames");

export default function Button(props) {
  let buttonClass = classNames({
    button: true,
    "button--confirm": props.confirm,
    "button--danger": props.danger,
  });

  return (
    <button
      className={buttonClass}
      cy-testid={props.testid}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
