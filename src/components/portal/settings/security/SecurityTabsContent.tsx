import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/3rdparty/ui/card";
import PasswordChangeForm from "./PasswordChangeForm";
import ConnectedDevices from "./ConnectedDevices";

export default function SecurityTabsContent() {
  return (
    <>
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TwoFactorAuth />
        </CardContent>
      </Card> */}

      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <ConnectedDevices />
        </CardContent>
      </Card>
    </>
  );
}
