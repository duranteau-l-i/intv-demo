import { title } from "@/components/primitives";
import Signup from "./signup";

export default function SignupPage() {
  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className={title()}>Signup</h1>
      </div>
      <Signup />
    </div>
  );
}
