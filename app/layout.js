import "./globals.css";
import { Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";
import { SiteProvider } from "@/components/SiteContext";

const body = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });
const head = Noto_Sans_Bengali({ subsets: ["bengali", "latin"], weight: ["600", "700", "800"], variable: "--font-head", display: "swap" });

export const metadata = {
  title: "Digital Income Academy | শিখুন, তৈরি করুন, আয় করুন — সৎভাবে",
  description: "ডিজিটাল স্কিল শিখুন, সৎভাবে নিজের ভবিষ্যৎ গড়ুন — অনলাইন ইনকাম, ওয়েবসাইট তৈরি, ডিজিটাল মার্কেটিং ও প্রফেশনাল টুলসের বাস্তবমুখী প্রশিক্ষণ।",
  openGraph: { title: "Digital Income Academy", description: "শিখুন, তৈরি করুন, আয় করুন — সৎভাবে", locale: "bn_BD", type: "website" },
};
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#020617" };

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${body.variable} ${head.variable}`}>
      <body>
        <SiteProvider>
          <VisitTracker />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SiteProvider>
      </body>
    </html>
  );
}
