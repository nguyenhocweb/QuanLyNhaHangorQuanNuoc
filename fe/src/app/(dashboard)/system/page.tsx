import { redirect } from "next/navigation";

export default function SystemAdminRootPage() {
    redirect("/system/dashboard");
}
