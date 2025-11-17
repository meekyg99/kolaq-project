import { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create Account | KOLAQ ALAGBO BITTERS",
};

export default function SignupPage() {
  return <SignupForm />;
}
