import { redirect } from "next/navigation";
export default function AdminPathRedirect({ params }) {
  const path = params.path?.join("/") || "";
  redirect(`/ceo-rifat-panel/${path}`);
}
