import { getUser } from "@/lib/auth/get-user";

export default async function Dashboardpage() {
  const user = await getUser();

  return (
    <>
      <div>Dashboardpage</div>
      <div>メールアドレス：{user.email}</div>
    </>
  );
}
