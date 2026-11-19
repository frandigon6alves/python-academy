import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FormEvent } from "react";
import { renderWithProviders } from "@/test/render";
import { TextField, validateForm } from "./Field";

function Form({ onValid }: { onValid: () => void }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validateForm(event.currentTarget)) onValid();
  }
  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextField label="Email" type="email" required />
      <TextField label="Password" type="password" required minLength={8} />
      <button type="submit">Send</button>
    </form>
  );
}

describe("TextField", () => {
  it("shows inline messages on submit and focuses the first invalid field", async () => {
    const onValid = vi.fn();
    renderWithProviders(<Form onValid={onValid} />);
    await userEvent.click(screen.getByRole("button", { name: "Send" }));

    const email = screen.getByLabelText("Email");
    expect(onValid).not.toHaveBeenCalled();
    expect(email).toHaveFocus();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("This field is required.");
  });

  it("validates a filled-in field on blur and clears the message once fixed", async () => {
    renderWithProviders(<Form onValid={vi.fn()} />);
    const email = screen.getByLabelText("Email");
    await userEvent.type(email, "ada");
    await userEvent.tab();
    expect(email).toHaveAccessibleDescription("Enter an email address like name@example.com.");

    await userEvent.type(email, "@example.com");
    expect(email).not.toHaveAttribute("aria-invalid");
  });

  it("lets the learner show and hide a password", async () => {
    renderWithProviders(<Form onValid={vi.fn()} />);
    const password = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(password).toHaveAttribute("type", "password");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(password).toHaveAttribute("type", "text");
  });
});
