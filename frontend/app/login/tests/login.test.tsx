import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginPage from "../page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({ router: () => "" })
}));

const submit = jest.fn((username: string, password: string) => {});

jest.mock("../hooks/useLogin", () =>
  jest.fn(() => ({
    submit,
    loading: false,
    error: "The username or password is wrong",
    setError: (value: string) => {}
  }))
);

describe("LoginPage", () => {
  it("renders a heading", () => {
    render(<LoginPage />);

    const heading = screen.getByText("Login");

    expect(heading).toBeInTheDocument();
  });

  it("renders an error message", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const usernameInput = screen.getByLabelText("Username");
    await user.type(usernameInput, "aaa");
    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "aaa");

    expect(usernameInput).toHaveValue("aaa");
    expect(passwordInput).toHaveValue("aaa");

    const button = screen.getByText("Submit");

    await user.click(button);

    expect(submit).toHaveBeenCalled();

    const errorMessage = screen.getByRole("error-message");
    expect(errorMessage).toBeInTheDocument();
  });
});
