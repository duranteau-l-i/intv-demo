import { title } from "@/components/primitives";
import Profile from "./profile";
import { getMe } from "@/app/api/userService";

export default async function ProfilePage() {
  const initialState = await getMe();

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className={title()}>Profile</h1>
      </div>
      <Profile initialState={initialState} />
    </div>
  );
}
