'use client';

import Script from 'next/script';

export default function GotekChatbot() {
  return (
    <Script
      id="gotek-chatbot-sdk"
      src="http://127.0.0.1:4317/sdk.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== 'undefined' && (window as any).gotekSDK) {
          (window as any).gotekSDK.run({
            websiteToken: "SUp0LpY7tHwideleMr8AzYhzBr3SBJXZm2-ijdnYqUk",
            baseUrl: "http://127.0.0.1:4317",
            autoOpen: true
          });
        }
      }}
    />
  );
}
