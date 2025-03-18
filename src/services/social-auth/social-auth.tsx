"use client";

import { Stack } from "@mantine/core";
import FacebookAuth from "./facebook/facebook-auth";
import { isFacebookAuthEnabled } from "./facebook/facebook-config";
import GoogleAuth from "./google/google-auth";
import { isGoogleAuthEnabled } from "./google/google-config";

export default function SocialAuth() {
  return (
    <Stack gap="md">
      {isGoogleAuthEnabled && (
        <div>
          <GoogleAuth />
        </div>
      )}
      {isFacebookAuthEnabled && (
        <div>
          <FacebookAuth />
        </div>
      )}
    </Stack>
  );
}
