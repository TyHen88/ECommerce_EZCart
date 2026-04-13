const ServiceId = {
  GOOGLE_AUTHORIZATION: "/oauth2/authorization/google",
  GOOGLE_CALLBACK: "/oauth2/callback/google",
  LEGACY_GOOGLE_CALLBACK: "/oauth2/oauth2/callback/google",
} as const;

export const oauth2Service = {
  getGoogleAuthorizationUrl: () => ServiceId.GOOGLE_AUTHORIZATION,
  getGoogleCallbackUrl: () => ServiceId.GOOGLE_CALLBACK,
  getLegacyGoogleCallbackUrl: () => ServiceId.LEGACY_GOOGLE_CALLBACK,

  redirectToGoogleLogin: () => {
    if (typeof window !== "undefined") {
      window.location.href = ServiceId.GOOGLE_AUTHORIZATION;
    }
  },
};
