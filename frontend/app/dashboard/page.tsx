import { getUsers } from "@/app/api/userService";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const initialState = await getUsers();

  return <Dashboard initialState={initialState} />;
}
