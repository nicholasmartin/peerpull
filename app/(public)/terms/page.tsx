import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Terms of Service | PeerPull",
  description: "PeerPull terms of service — rules and guidelines for using the platform.",
};

export default function TermsPage() {
  return (
    <div className="bg-dark-bg min-h-screen py-16 md:py-24">
      <div className="container max-w-3xl mx-auto px-4 md:px-6">
        <h1 className={`${montserrat.className} text-3xl md:text-4xl font-bold text-dark-text mb-2`}>
          Terms of Service
        </h1>
        <p className="text-dark-text-muted text-sm mb-10">Last updated: March 4, 2026</p>

        <div className="space-y-8 text-dark-text-muted leading-relaxed">
          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or using PeerPull, you agree to these terms of service.
              If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              2. Description of Service
            </h2>
            <p>
              PeerPull is a peer-to-peer feedback exchange platform. Users submit products or
              projects for feedback and provide video feedback to other users. The platform uses
              a points system (PeerPoints) to facilitate fair exchanges: you earn PeerPoints by
              giving feedback and spend points to receive feedback.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              3. Account Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate information when creating your account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must be at least 18 years old to use PeerPull.</li>
              <li>One account per person. Creating multiple accounts to manipulate the PeerPoints system is prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              4. PeerPoints
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>PeerPoints have no monetary value and cannot be exchanged for cash.</li>
              <li>Points are earned by completing video feedback that meets our quality guidelines.</li>
              <li>Points are spent when submitting a product for feedback.</li>
              <li>We reserve the right to adjust point balances, rewards, and costs to maintain platform health.</li>
              <li>Abuse of the referral system or point economy may result in account suspension.</li>
            </ul>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              5. Content Guidelines
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Video feedback must be constructive, honest, and relevant to the product being reviewed.</li>
              <li>Do not include offensive, abusive, or discriminatory content in feedback.</li>
              <li>Do not submit products that contain illegal content or violate third-party rights.</li>
              <li>You retain ownership of content you create, but grant PeerPull a license to host and display it within the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              6. Feedback Quality
            </h2>
            <p>
              Feedback that is low-effort, off-topic, or does not meet minimum duration requirements
              may be rejected. Repeated low-quality submissions may affect your quality score and
              ability to earn points.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              7. Prohibited Conduct
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manipulating the feedback queue or PeerPoints system.</li>
              <li>Harassing other users through feedback or any other means.</li>
              <li>Using automated tools or bots to interact with the platform.</li>
              <li>Attempting to access other users&apos; data or accounts.</li>
            </ul>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              8. Termination
            </h2>
            <p>
              We may suspend or terminate your account if you violate these terms. You may
              delete your account at any time through your account settings or by contacting us.
              Upon termination, your PeerPoints balance is forfeited.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              9. Disclaimer
            </h2>
            <p>
              PeerPull is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee
              the quality, accuracy, or usefulness of feedback received through the platform.
              Users provide feedback based on their own experience and opinions.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              10. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, PeerPull and its operators shall not be
              liable for any indirect, incidental, or consequential damages arising from your
              use of the platform.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              11. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of PeerPull after
              changes are posted constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className={`${montserrat.className} text-xl font-semibold text-dark-text mb-3`}>
              12. Contact
            </h2>
            <p>
              Questions about these terms? Contact us at{" "}
              <a href="mailto:support@peerpull.com" className="text-blue-primary hover:underline">
                support@peerpull.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
