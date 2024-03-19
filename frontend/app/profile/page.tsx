import { title } from "@/components/primitives";
import Profile from "./profile";
import { getMe } from "@/app/api/userService";

export default async function ProfilePage() {
  const initialState = await getMe();

  return (
    <div>
      <h1 className={title()}>Profile</h1>
      <Profile initialState={initialState} />
    </div>
  );
}
