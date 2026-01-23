import { SocialAuthProvider } from "../models";

export function openSocialPopup(url: string, provider: SocialAuthProvider) {
  const width = 500;
  const height = 600;

  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    url,
    `${provider}-oauth`,
    `
      width=${width},
      height=${height},
      left=${left},
      top=${top},
      resizable=yes,
      scrollbars=yes,
    `.replace(/\s+/g, '')
  );

  if (!popup) {
    throw new Error('Popup blocked by browser');
  }

  popup.focus();
  return popup;
}
