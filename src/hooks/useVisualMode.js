import { useState, useEffect } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  useEffect(
    () => {
      setMode(history[history.length - 1]);
    },
    [history]
  );

  const transition = function (mode, bool = false) {
    if (bool) {
      setHistory((prev) => prev.slice(0, -1));
    }
    setHistory((prev) => [...prev, mode]);
  };

  const back = function () {
    if (history.length > 0) {
      setHistory((prev) =>
        prev.filter((ele) => prev.indexOf(ele) !== prev.length - 1)
      );
    }
  };

  return {
    mode,
    transition,
    back,
  };
}
