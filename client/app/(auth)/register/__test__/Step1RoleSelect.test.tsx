import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import Step1RoleSelect from "../Step1RoleSelect";
import { RoleId } from "@/types/registerType";

// ─── Mock ROLES from registerUtils ───────────────────────────────────────────

vi.mock("@/utils/registerUtils", () => ({
  ROLES: [
    {
      id: "student",
      title: "Student",
      desc: "Preparing for JAMB, WAEC or Post-UTME",
      Icon: () => null,
      iconBg: "bg-blue-50",
      iconCls: "text-blue-600",
      badge: null,
    },
    {
      id: "tutor",
      title: "Tutor",
      desc: "Teach and earn on Gravitas",
      Icon: () => null,
      iconBg: "bg-green-50",
      iconCls: "text-green-600",
      badge: { label: "Earn money", cls: "bg-green-100 text-green-700" },
    },
    {
      id: "school",
      title: "School",
      desc: "Manage students and results",
      Icon: () => null,
      iconBg: "bg-yellow-50",
      iconCls: "text-yellow-600",
      badge: null,
    },
    {
      id: "professional",
      title: "Professional",
      desc: "Preparing for professional exams",
      Icon: () => null,
      iconBg: "bg-purple-50",
      iconCls: "text-purple-600",
      badge: { label: "New", cls: "bg-purple-100 text-purple-700" },
    },
  ],
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockOnSelect = vi.fn();
const mockOnContinue = vi.fn();

function renderComponent(selected: RoleId | null = null) {
  return render(
    <Step1RoleSelect selected={selected} onSelect={mockOnSelect} onContinue={mockOnContinue} />,
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("Step1RoleSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────────────────────────
  // Rendering
  // ───────────────────────────────────────────
  describe("Rendering", () => {
    test("renders the header and subtext", () => {
      renderComponent();

      expect(screen.getByText("Who are you joining as?")).toBeInTheDocument();
      expect(screen.getByText(/choose your account type/i)).toBeInTheDocument();
    });

    test("renders all four role cards", () => {
      renderComponent();

      expect(screen.getByText("Student")).toBeInTheDocument();
      expect(screen.getByText("Tutor")).toBeInTheDocument();
      expect(screen.getByText("School")).toBeInTheDocument();
      expect(screen.getByText("Professional")).toBeInTheDocument();
    });

    test("renders role descriptions", () => {
      renderComponent();

      expect(screen.getByText("Preparing for JAMB, WAEC or Post-UTME")).toBeInTheDocument();
      expect(screen.getByText("Teach and earn on Gravitas")).toBeInTheDocument();
      expect(screen.getByText("Manage students and results")).toBeInTheDocument();
      expect(screen.getByText("Preparing for professional exams")).toBeInTheDocument();
    });

    test("renders badges only for roles that have them", () => {
      renderComponent();

      expect(screen.getByText("Earn money")).toBeInTheDocument();
      expect(screen.getByText("New")).toBeInTheDocument();

      // Student card has no badge
      const studentCard = screen.getByText("Student").closest("div");
      expect(studentCard).not.toHaveTextContent("Earn money");
    });

    test("renders the Continue button", () => {
      renderComponent();
      expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    });

    test("renders without crashing when selected is null", () => {
      renderComponent(null);
      expect(screen.getByText("Who are you joining as?")).toBeInTheDocument();
    });
  });

  // ───────────────────────────────────────────
  // Role Selection
  // ───────────────────────────────────────────
  describe("Role Selection", () => {
    test("clicking a role card calls onSelect with the correct role id", () => {
      renderComponent();

      fireEvent.click(screen.getByText("Student"));
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith("student");
    });

    test("clicking each role passes its own id to onSelect", () => {
      renderComponent();

      const roles: { title: string; id: RoleId }[] = [
        { title: "Student", id: "student" },
        { title: "Tutor", id: "tutor" },
        { title: "School", id: "school" },
        { title: "Professional", id: "professional" },
      ];

      roles.forEach(({ title, id }) => {
        fireEvent.click(screen.getByText(title));
        expect(mockOnSelect).toHaveBeenLastCalledWith(id);
      });

      expect(mockOnSelect).toHaveBeenCalledTimes(4);
    });

    test("clicking the same card twice calls onSelect twice", () => {
      renderComponent();

      fireEvent.click(screen.getByText("Tutor"));
      fireEvent.click(screen.getByText("Tutor"));

      expect(mockOnSelect).toHaveBeenCalledTimes(2);
      expect(mockOnSelect).toHaveBeenNthCalledWith(1, "tutor");
      expect(mockOnSelect).toHaveBeenNthCalledWith(2, "tutor");
    });
  });

  // ───────────────────────────────────────────
  // Selected State Styling
  // ───────────────────────────────────────────
  describe("Selected State Styling", () => {
    test("selected card gets border-green-800 class", () => {
      renderComponent("student");

      const studentCard = screen.getByText("Student").closest("[class*='rounded-2xl']");
      expect(studentCard?.className).toContain("border-green-800");
    });

    test("unselected cards get border-green-900/10 class", () => {
      renderComponent("student");

      const tutorCard = screen.getByText("Tutor").closest("[class*='rounded-2xl']");
      expect(tutorCard?.className).toContain("border-green-900/10");
    });

    test("check badge is visible (opacity-100) on selected card", () => {
      renderComponent("tutor");

      const tutorCard = screen.getByText("Tutor").closest("[class*='rounded-2xl']");
      const checkBadge = tutorCard?.querySelector("[class*='opacity-']");
      expect(checkBadge?.className).toContain("opacity-100");
    });

    test("check badge is hidden (opacity-0) on unselected cards", () => {
      renderComponent("tutor");

      const studentCard = screen.getByText("Student").closest("[class*='rounded-2xl']");
      const checkBadge = studentCard?.querySelector("[class*='opacity-']");
      expect(checkBadge?.className).toContain("opacity-0");
    });

    test("no card shows as selected when selected prop is null", () => {
      renderComponent(null);

      const cards = document.querySelectorAll("[class*='rounded-2xl']");
      cards.forEach((card) => {
        expect(card.className).not.toContain("border-green-800");
      });
    });

    test("only the selected card has the active shadow class", () => {
      renderComponent("school");

      const schoolCard = screen.getByText("School").closest("[class*='rounded-2xl']");
      expect(schoolCard?.className).toContain("shadow-[0_0_0_3px_rgba(26,74,46,0.12)");

      const studentCard = screen.getByText("Student").closest("[class*='rounded-2xl']");
      expect(studentCard?.className).not.toContain("shadow-[0_0_0_3px_rgba(26,74,46,0.12)");
    });
  });

  // ───────────────────────────────────────────
  // Continue Button
  // ───────────────────────────────────────────
  describe("Continue Button", () => {
    test("clicking Continue calls onContinue", () => {
      renderComponent("student");

      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      expect(mockOnContinue).toHaveBeenCalledTimes(1);
    });

    test("Continue button calls onContinue even when no role is selected", () => {
      renderComponent(null);

      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      expect(mockOnContinue).toHaveBeenCalledTimes(1);
    });

    test("onSelect and onContinue are independent — clicking a card does not trigger onContinue", () => {
      renderComponent();

      fireEvent.click(screen.getByText("Professional"));

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnContinue).not.toHaveBeenCalled();
    });
  });
});
