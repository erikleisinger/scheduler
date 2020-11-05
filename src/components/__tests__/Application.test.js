import React from "react";

import axios from "axios";

import {
  getByText,
  getAllByTestId,
  getByTestId,
  getByAltText,
  getByPlaceholderText,
  render,
  cleanup,
  waitForElement,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
  it("loads data, books an interview and reduces spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(
      getByPlaceholderText(appointment, "Please enter your name"),
      { target: { value: "Lydia Miller-Jones" } }
    );
    fireEvent.click(getByTestId(appointment, "1"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    const monday = getByTestId(container, "Monday");
    expect(getByText(monday, "no spots remaining")).toBeInTheDocument();
  });
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[1];
    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(
      getByPlaceholderText(appointment, "Please enter your name"),
      { target: { value: "Archie Bowen" } }
    );
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => getByText(appointment, "Archie Bowen"));

    const monday = getByTestId(container, "Monday");
    expect(getByText(monday, "no spots remaining")).toBeInTheDocument();
  });
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[1];
    fireEvent.click(getByAltText(appointment, "Delete"));
    await waitForElement(() => getByText(appointment, "Confirm"));
    fireEvent.click(getByText(appointment, "Confirm"));
    await waitForElement(() => getByText(appointment, "Deleting"));
    await waitForElement(() => getByAltText(appointment, "Add"));

    const monday = getByTestId(container, "Monday");
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();
  });
  it("shows a save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[1];
    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(
      getByPlaceholderText(appointment, "Please enter your name"),
      { target: { value: "Erik" } }
    );
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() =>
      getByText(
        appointment,
        "There was an error saving the appointment. Please try again or contact a system admin."
      )
    );
  });
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[1];
    fireEvent.click(getByAltText(appointment, "Delete"));
    await waitForElement(() => getByText(appointment, "Confirm"));
    fireEvent.click(getByText(appointment, "Confirm"));
    await waitForElement(() =>
      getByText(
        appointment,
        "There was an error deleting the appointment. Please try again or contact a system admin."
      )
    );
  });
});
