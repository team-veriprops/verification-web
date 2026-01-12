import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/3rdparty/ui/card";
import ProfileForm from "./ProfileForm";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { Separator } from "@components/3rdparty/ui/separator";
import ConnectedAccounts from "./ConnectedAccounts";

export default function ProfileTabsContent() {
  return (
    <>
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfilePictureUpload />

          <Separator />

          <ProfileForm />
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ConnectedAccounts />
        </CardContent>
      </Card>
    </>
  );
}
