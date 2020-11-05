import React from "react";

import { render, fireEvent, cleanup } from "@testing-library/react";

import Form from "../Appointment/Form";

const interviewers = [
  {
    1: {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png",
    },
  },
  {
    2: {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png",
    },
  },
];
afterEach(cleanup);

describe("Form", () => {
  const onCancel = jest.fn();
  const onSave = jest.fn();
  it("Should render", () => {
    render(
      <Form interviewers={interviewers} onCancel={onCancel} onSave={onSave} />
    );
  });
  it("renders the input box with placeholder if no name is provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} onCancel={onCancel} onSave={onSave} />
    );
    const input = getByPlaceholderText("Please enter your name");
    expect(input).toHaveValue("");
  });
  it("renders the input box with student name if one is provided", () => {
    const { getByPlaceholderText } = render(
      <Form
        name="Erik"
        interviewers={interviewers}
        onCancel={onCancel}
        onSave={onSave}
      />
    );
    const input = getByPlaceholderText("Please enter your name");
    expect(input).toHaveValue("Erik");
  });
  it("validates that the student's name is not blank", () => {
    const { getByText } = render(
      <Form
        name=""
        interviewers={interviewers}
        onCancel={onCancel}
        onSave={onSave}
      />
    );
    fireEvent.click(getByText("Save"));
    expect(getByText(/cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );

    fireEvent.click(getByText("Save"));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.change(getByPlaceholderText("Please enter your name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByText("Save"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", null);
  });
  it("calls onCancel and resets the input field", () => {
    const onCancel = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Mill-Jones"
        onSave={() => jest.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.click(getByText("Save"));

    fireEvent.change(getByPlaceholderText("Please enter your name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByText("Cancel"));

    expect(queryByText(/cannot be blank/i)).toBeNull();

    expect(getByPlaceholderText("Please enter your name")).toHaveValue("");

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
