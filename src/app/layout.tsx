import { Metadata } from "next";
import "@app/globals.css";
import { ClientWrapperProvider } from "providers/client-wrapper";

export const metadata: Metadata = {
  title: "Verify lands and buildings | Veriprops",
  description:
    "Nigeria's Property Truth Layer. We exist to prevent property scams and bring transparency to real estate transactions across Nigeria.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <ClientWrapperProvider>{children}</ClientWrapperProvider>
      </body>
    </html>
  );
}
