import SettingsTabs from "@components/portal/settings/SettingsTabs";
import { Metadata } from "next";

const title = "Settings";
const description = "Manage your account settings and preferences.";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

interface SettingsPageProps {
  params: Promise<{
    active_tab?: string;
  }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { active_tab } = await params;

  return (
    <SettingsTabs
      active_tab={active_tab!}
      title={title}
      description={description}
    />
  );
}
