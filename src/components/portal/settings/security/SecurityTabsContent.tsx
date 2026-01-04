import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/3rdparty/ui/card";
import PasswordChangeForm from "./PasswordChangeForm";
import TwoFactorAuth from "./TwoFactorAuth";
import ConnectedDevices from "./ConnectedDevices";

export default function SecurityTabsContent() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TwoFactorAuth />
        </CardContent>
      </Card>

      <Card>
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
