import { getUsers } from "@/app/api/userService";
import Dashboard from "./dashboard";
import { title } from "@/components/primitives";

export default async function DashboardPage() {
  const initialState = await getUsers();

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className={title()}>Dashboard</h1>
      </div>
      <Dashboard initialState={initialState} />
    </div>
  );
}
