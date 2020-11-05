import React, { useEffect } from "react";
import "../styles/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../../hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDITING = "EDITING";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition("SAVING");
    props
      .bookInterview(props.id, { interview: interview })
      .then((data) => {
        transition(SHOW);
      })
      .catch((err) => {
        transition(ERROR_SAVE, true);
      });
  }

  function cancel() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((err) => {
        transition(ERROR_DELETE, true);
      });
  }
  function confirm() {
    transition(CONFIRM);
  }

  function edit() {
    transition(EDITING);
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === "EMPTY" && <Empty onAdd={(evt) => transition(CREATE)} />}
      {mode === "SHOW" && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
          onEdit={edit}
          onDelete={confirm}
        />
      )}
      {mode === "CREATE" && (
        <Form onCancel={back} interviewers={props.interviewers} onSave={save} />
      )}
      {mode === "SAVING" && <Status message="Saving" />}
      {mode === "CONFIRM" && (
        <Confirm
          message="Are you sure you want to do delete? This action is irreversible."
          onConfirm={cancel}
          onCancel={back}
        />
      )}
      {mode === "DELETING" && <Status message="Deleting" />}
      {mode === "EDITING" && (
        <Form
          onCancel={back}
          onSave={save}
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === "ERROR_SAVE" && (
        <Error
          message="There was an error saving the appointment. Please try again or contact a system admin."
          onClose={back}
        />
      )}
      {mode === "ERROR_DELETE" && (
        <Error
          message="There was an error deleting the appointment. Please try again or contact a system admin."
          onClose={back}
        />
      )}
    </article>
  );
}
