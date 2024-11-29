// ProfilePictureForm.tsx
import React, { useState } from "react";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Backend_URL } from "@/lib/Constants";
import { Input } from "../ui/input";

const ProfilePictureForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const session = await getSession();
    if (!session || !selectedFile) {
      console.error("User not logged in or file not selected");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", selectedFile);
    formData.append("profpicUrl", ""); // You can adjust this if needed

    try {
      setUploading(true);
      const response = await fetch(
        `${Backend_URL}/profile/img/${session.user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.backendTokens.access_token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("Error uploading profile picture:", response.statusText);
        return;
      }

      const data = await response.json();
      setProfilePicUrl(data); // Assuming API returns the uploaded image URL
      console.log("Profile picture updated:", data);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-picture-upload">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? "Uploading..." : "Upload Profile Picture"}
      </Button>
      {profilePicUrl && (
        <div className="mt-4">
          <p>Profile Picture Uploaded Successfully!</p>
          <img
            src={profilePicUrl}
            alt="Profile"
            className="mt-2 w-32 h-32 rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePictureForm;
