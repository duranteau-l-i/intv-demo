import { title } from "@/components/primitives";
import Login from "./login";

export default function LoginPage() {
  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className={title()}>Login</h1>
      </div>
      <Login />
    </div>
  );
}
