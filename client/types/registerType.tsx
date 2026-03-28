import { LucideIcon } from "lucide-react";
export interface Props {
  role: RoleId;
  onBack: () => void;
  onSubmit: (email: string) => void;
}

export type RoleCard = {
  id: RoleId;
  Icon: LucideIcon;
  title: string;
  desc: string;
  badge?: { label: string; cls: string };
  iconBg: string;
  iconCls: string;
};

export type RoleId = "student" | "parent" | "tutor" | "school" | "teacher" | "professional";
export type ExamTarget = { value: string; label: string; Icon: LucideIcon };
export type RoleConfig = {
  Icon: LucideIcon;
  label: string;
  heading: string;
  sub: string;
  showExamTarget: boolean;
  showSchoolName: boolean;
  showSubject: boolean;
  showLGA: boolean;
};
