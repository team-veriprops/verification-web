import SettingsComponentPage from "@components/portal/settings/SettingsComponentPage";
import { Metadata } from "next";

const title = "Settings";
const description = "Manage your account settings and preferences.";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

interface SettingsPageProps {
  params: Promise<{
    activeTab?: string;
  }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { activeTab } = await params;

  return (
    <SettingsComponentPage
      activeTab={activeTab!}
      title={title}
      description={description}
    />
  );
}
