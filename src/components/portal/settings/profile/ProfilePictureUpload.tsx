"use client";

import { useState } from "react";
import { Button } from "@3rdparty/ui/button";
import { toast } from "@3rdparty/ui/use-toast";
import { Upload, User } from "lucide-react";
import { Label } from "@components/3rdparty/ui/label";
import Image from "next/image";

export default function ProfilePictureUpload() {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Profile picture updated",
        description: "Your new profile picture has been uploaded.",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="profile-picture">Profile Picture</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                document.getElementById("profile-picture")?.click()
              }
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureUpload}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            JPG, PNG or GIF. Max size 2MB.
          </p>
        </div>
      </div>
    </>
  );
}
