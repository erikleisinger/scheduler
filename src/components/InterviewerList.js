import React from "react";
import PropTypes from "prop-types";
import "./styles/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";

function InterviewerList(props) {
  let interviewerListItem = props.interviewers.map((interviewer) => {
    return (
      <InterviewerListItem
        testid={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        setInterviewer={(e) => props.setInterviewer(interviewer.id)}
        selected={props.interviewer === interviewer.id}
      ></InterviewerListItem>
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers __header text--light">Interviewers</h4>
      <ul className="interviewers __list">{interviewerListItem}</ul>
    </section>
  );
}

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired,
};

export default InterviewerList;
