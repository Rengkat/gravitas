import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import ForgotPassword from "../ForgotPassword";

describe("ForgotPassword Component", () => {
  test("renders the component and handles user interactions", () => {
    const mockOnBack = vi.fn();
    render(<ForgotPassword onBack={mockOnBack} />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const sendButton = screen.getByText("Send Reset Link");
    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    // Simulate button click
    fireEvent.click(sendButton);
  });
});
