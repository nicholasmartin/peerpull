import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Privacy Policy | PeerPull",
  description: "PeerPull privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-dark-bg min-h-screen py-16 md:py-24">
      <div className="container max-w-3xl mx-auto px-4 md:px-6">
        <h1 className={`${montserrat.className} text-3xl md:text-4xl font-bold text-dark-text mb-2`}>
          Privacy Policy
        </h1>
        <p className="text-dark-text-muted text-sm mb-10">Last updated: March 4, 2026</p>

        <div className="space-y-8 text-dark-text-muted leading-relaxed">
          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              1. Information We Collect
            </h2>
            <p className="mb-3">When you use PeerPull, we may collect the following information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-dark-text">Account information:</strong> Name, email address, and password when you create an account.</li>
              <li><strong className="text-dark-text">Profile information:</strong> Avatar, expertise areas, and bio that you choose to provide.</li>
              <li><strong className="text-dark-text">Content:</strong> Video feedback you record, feedback requests you submit, and any associated text or URLs.</li>
              <li><strong className="text-dark-text">Usage data:</strong> Pages visited, features used, and interactions within the platform.</li>
              <li><strong className="text-dark-text">OAuth data:</strong> If you sign in via Google or another provider, we receive your name, email, and profile picture from that provider.</li>
            </ul>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, operate, and maintain the PeerPull platform.</li>
              <li>To manage your account, PeerPoints balance, and feedback queue position.</li>
              <li>To send notifications about feedback activity (configurable in your settings).</li>
              <li>To improve the platform and develop new features.</li>
              <li>To prevent fraud and enforce our terms of service.</li>
            </ul>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              3. Data Storage & Security
            </h2>
            <p>
              Your data is stored securely using Supabase infrastructure. We use row-level security
              policies to ensure users can only access their own data. Video feedback is stored in
              secure cloud storage. We use cookie-based authentication with no client-side token storage.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              4. Data Sharing
            </h2>
            <p className="mb-3">We do not sell your personal information. We may share data in the following limited circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-dark-text">With other users:</strong> Your profile name, avatar, and video feedback are visible to the users you are exchanging feedback with.</li>
              <li><strong className="text-dark-text">Service providers:</strong> We use third-party services (e.g., email delivery, cloud hosting) that process data on our behalf.</li>
              <li><strong className="text-dark-text">Legal requirements:</strong> We may disclose data if required by law or to protect our rights.</li>
            </ul>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              5. Your Rights
            </h2>
            <p>
              You can access, update, or delete your profile information from your account settings.
              To request full deletion of your account and associated data, please contact us.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              6. Cookies
            </h2>
            <p>
              We use essential cookies for authentication and session management. These are necessary
              for the platform to function and cannot be disabled.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              7. Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify registered users
              of significant changes via email or in-app notification.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              8. Contact
            </h2>
            <p>
              If you have questions about this privacy policy, please contact us at{" "}
              <a href="mailto:privacy@peerpull.com" className="text-blue-primary hover:underline">
                privacy@peerpull.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
