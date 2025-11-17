import { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | KOLAQ ALAGBO BITTERS",
};

export default function LoginPage() {
  return <LoginForm />;
}
