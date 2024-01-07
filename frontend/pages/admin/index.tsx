import AdminHeader from "@/components/AdminHeader";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AdminPanel = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/logo");
  });
  return <div></div>;
};

export default AdminPanel;
