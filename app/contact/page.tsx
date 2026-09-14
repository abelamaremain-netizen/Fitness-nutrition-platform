import { getSiteContent } from "@/src/lib/services/content-public";
import ContactClient from "./ContactClient";

export const revalidate = 0;

export default async function ContactPage() {
  const content = await getSiteContent().catch(() => ({} as Record<string, string>));
  return <ContactClient content={content} />;
}
