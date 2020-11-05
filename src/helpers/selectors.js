function getAppointmentsForDay(state, day) {
  const dayObj = state.days.find(({ name }) => name === day);

  if (dayObj) {
    const appointmentsArray = dayObj.appointments.map(
      (item) => state.appointments[item]
    );
    return appointmentsArray;
  } else {
    return [];
  }
}

function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewObj = {};
  interviewObj.student = interview.student;

  const interviewerNumber = interview.interviewer;
  const interviewerData = state.interviewers[0][interviewerNumber];
  interviewObj.interviewer = interviewerData;
  return interviewObj;
}

function getInterviewersForDay(state, day) {
  const dayObj = state.days.find(({ name }) => name === day);

  if (dayObj) {
    const interviewersArray = dayObj.interviewers.map(
      (item) => state.interviewers[0][item]
    );
    return interviewersArray;
  } else {
    return [];
  }
}

export { getAppointmentsForDay, getInterview, getInterviewersForDay };
