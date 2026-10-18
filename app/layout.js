import "./globals.css";
import { Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";
import ContactButtons from "@/components/ContactButtons";
import OneSignalInit from "@/components/OneSignalInit";
import JsonLd from "@/components/JsonLd";
import { initThemeScript } from "@/lib/theme";
import { SiteProvider } from "@/components/SiteContext";

const body = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });
const head = Noto_Sans_Bengali({ subsets: ["bengali", "latin"], weight: ["600", "700", "800"], variable: "--font-head", display: "swap" });

export const metadata = {
  metadataBase: new URL("https://digitalincomeacademy.site"),
  title: {
    default: "Digital Income Academy | শিখুন, তৈরি করুন, আয় করুন — সৎভাবে",
    template: "%s | Digital Income Academy",
  },
  description: "ডিজিটাল স্কিল শিখুন, সৎভাবে নিজের ভবিষ্যৎ গড়ুন — অনলাইন ইনকাম, ওয়েবসাইট তৈরি, ডিজিটাল মার্কেটিং ও প্রফেশনাল টুলসের বাস্তবমুখী প্রশিক্ষণ।",
  keywords: ["ডিজিটাল ইনকাম একাডেমি", "অনলাইন ইনকাম", "ফ্রিল্যান্সিং", "ডিজিটাল মার্কেটিং", "ওয়েবসাইট তৈরি", "বাংলা কোর্স", "digital income academy", "online income bangladesh"],
  authors: [{ name: "Digital Income Academy" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Digital Income Academy",
    description: "শিখুন, তৈরি করুন, আয় করুন — সৎভাবে",
    url: "https://digitalincomeacademy.site",
    siteName: "Digital Income Academy",
    locale: "bn_BD",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Digital Income Academy", description: "শিখুন, তৈরি করুন, আয় করুন — সৎভাবে" },
};
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#020617" };

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${body.variable} ${head.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: initThemeScript() }} />
      <body>
        <JsonLd />
        <SiteProvider>
          <VisitTracker />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ContactButtons />
          <OneSignalInit />
        </SiteProvider>
      </body>
    </html>
  );
}
