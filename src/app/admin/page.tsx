import { redirect } from "next/navigation";

export default function AdminDashboard() {
    // Automatically redirect to articles page
    redirect("/admin/articles");
}