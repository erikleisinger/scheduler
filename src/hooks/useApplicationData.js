import { useReducer, useEffect } from "react";
import axios from "axios";

require("dotenv");
require("process");
require("ws");

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: [],
  });

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers,
        };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.appointments,
          days: action.days,
        };
    }
  }

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  // Fetch schedule data from PSQL server

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days").then((result) => {
        return result.data;
      }),
      axios.get("http://localhost:8001/api/appointments").then((result) => {
        return result.data;
      }),
      axios.get("http://localhost:8001/api/interviewers").then((result) => {
        return [result.data];
      }),
    ]).then((result) => {
      return dispatch({
        type: SET_APPLICATION_DATA,
        days: result[0],
        appointments: result[1],
        interviewers: result[2],
      });
    });
  }, [state.day]);

  // configure webSocket connection with server

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8001");
    websocket.onopen = function () {
      websocket.send("ping");
    };
    websocket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "SET_INTERVIEW") {
        setInterview(msg);
      }
    };
  });

  // setInterview updates interviews in real time via WebSocket connection
  // Any time an interview is saved or deleted by any user, all users are notified
  // via msg 'SET_INTERVIEW', and setInterview() updates the DOM to reflect changes. 

  function setInterview(msg) {
    const appointment = {
      ...state.appointments[msg.id],
      interview: msg.interview,
    };
    const appointments = {
      ...state.appointments,
      [msg.id]: appointment,
    };
    const days = [...state.days];

    dispatch({ type: SET_INTERVIEW, appointments, days });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    const days = [...state.days];
    const currentDayIndex = days.findIndex((ele) => ele.name === state.day);
    days[currentDayIndex].spots += 1;

    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then((data) => {
        if (data.appointments) {
          const appointments = data.appointments;
        }
        if (data.days) {
          const days = data.days;
        }
      })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, appointments, days });
      });
  }

  function bookInterview(id, interview) {
    const days = [...state.days];
    const currentDayIndex = days.findIndex((ele) => ele.name === state.day);
    if (!state.appointments[id].interview) {
      days[currentDayIndex].spots -= 1;
    }

    const appointment = {
      ...state.appointments[id],
      ...interview,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, interview)
      .then((data) => {
        if (data.status === 204) {
          if (data.days) {
            const days = data.days;
          }
        }
      })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, appointments, days });
      });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    setInterview,
  };
}
