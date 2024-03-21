import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignupPage from "../page";

const handleSubmit = jest.fn((firstName: string, lastName: string) => {});

jest.mock("../hooks/useSignup", () =>
  jest.fn(() => ({
    handleSubmit,
    error: "firstName must be longer than or equal to 3 characters",
    setError: (value: string) => {}
  }))
);

describe("SignupPage", () => {
  it("renders the profile", () => {
    render(<SignupPage />);

    const heading = screen.getByText("Signup");

    expect(heading).toBeInTheDocument();
  });

  it("renders an error message", async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    const firstNameInput = screen.getByLabelText("FirstName");
    await user.type(firstNameInput, "aaa");
    const lastNameInput = screen.getByLabelText("LastName");
    await user.type(lastNameInput, "aaa");

    expect(firstNameInput).toHaveValue("aaa");
    expect(lastNameInput).toHaveValue("aaa");

    const usernameInput = screen.getByLabelText("Username");
    await user.type(usernameInput, "test");
    expect(usernameInput).toHaveValue("test");

    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "Test@123");
    expect(passwordInput).toHaveValue("Test@123");

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");

    const button = screen.getByText("Submit");

    await user.click(button);

    expect(handleSubmit).toHaveBeenCalled();

    const errorMessage = screen.getByRole("error-message");
    expect(errorMessage).toBeInTheDocument();
  });
});
