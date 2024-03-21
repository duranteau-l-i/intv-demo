import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DashboardPage from "../dashboard";
import { Role } from "@/entities/user";

jest.mock("react-query", () => ({
  useQuery: jest.fn().mockReturnValue({
    data: [
      {
        id: "1",
        firstName: "john",
        lastName: "doe",
        username: "admin",
        email: "admin@example.com",
        role: "admin"
      },
      {
        id: "2",
        firstName: "jane",
        lastName: "doe",
        username: "user",
        email: "user@example.com",
        role: "user"
      }
    ],
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true
  })
}));

const handleSubmit = jest.fn(() => {});

jest.mock("../hooks/useAddUser", () =>
  jest.fn(() => ({
    handleSubmit,
    loading: false,
    error: "firstName must be longer than or equal to 3 characters",
    setError: (value: string) => {}
  }))
);

jest.mock("../hooks/useCurrentUser", () =>
  jest.fn(() => ({
    role: Role.admin,
    currentUserId: "1"
  }))
);

const handleDelete = jest.fn(() => {});

jest.mock("../hooks/useDeleteUser", () =>
  jest.fn(() => ({
    handleDelete,
    deleteLoading: false,
    deleteError: "",
    setDeleteError: (value: string) => {}
  }))
);

describe("DashboardPage", () => {
  it("renders the user", async () => {
    render(<DashboardPage />);

    const userJohn = screen.queryByText("john");
    expect(userJohn).not.toBeInTheDocument();

    const userJane = screen.getByText("jane");
    expect(userJane).toBeInTheDocument();
  });

  it("renders an error message", async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

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

  it("should remove the user from the table", async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    const button = screen.getByText("delete");
    await user.click(button);

    const confirmButton = screen.getByText("Delete");
    await user.click(confirmButton);

    expect(handleDelete).toHaveBeenCalled();
  });
});
