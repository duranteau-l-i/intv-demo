import { getUsers } from "@/app/api/userService";
import { title } from "@/components/primitives";
import Dashboard from "./dashboard";

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
