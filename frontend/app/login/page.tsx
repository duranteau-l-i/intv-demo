import { title } from "@/components/primitives";
import Login from "./login";

export default function LoginPage() {
  return (
    <div>
      <h1 className={title()}>Login</h1>
      <Login />
    </div>
  );
}
