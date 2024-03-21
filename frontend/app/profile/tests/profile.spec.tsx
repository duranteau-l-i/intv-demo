import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProfilePage from "../profile";

jest.mock("react-query", () => ({
  useQuery: jest.fn().mockReturnValue({
    data: {
      id: "1",
      firstName: "john",
      lastName: "doe",
      username: "admin",
      email: "admin@example.com",
      role: "admin"
    },
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true
  })
}));

jest.mock("../hooks/useUpdate", () =>
  jest.fn(() => ({
    update: function (firstName: string, lastName: string) {},
    updateLoading: false,
    updateError: "firstName must be longer than or equal to 3 characters",
    setUpdateError: (value: string) => {}
  }))
);

jest.mock("../hooks/useLogout", () =>
  jest.fn(() => ({
    logout: () => {}
  }))
);

describe("ProfilePage", () => {
  it("renders the profile", () => {
    render(<ProfilePage />);

    const firstNameInput = screen.getByLabelText("FirstName");
    expect(firstNameInput).toHaveValue("john");

    const lastNameInput = screen.getByLabelText("LastName");
    expect(lastNameInput).toHaveValue("doe");

    const usernameInput = screen.getByLabelText("Username");
    expect(usernameInput).toHaveValue("admin");
  });

  it("renders an error message", async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    const firstNameInput = screen.getByLabelText("FirstName");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "aaa");
    const lastNameInput = screen.getByLabelText("LastName");
    await user.clear(lastNameInput);
    await user.type(lastNameInput, "aaa");

    expect(firstNameInput).toHaveValue("aaa");
    expect(lastNameInput).toHaveValue("aaa");

    const button = screen.getByText("Update");

    await user.click(button);

    const errorMessage = screen.getByRole("error-message");
    expect(errorMessage).toBeInTheDocument();
  });
});
