import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy | Leadership by Design"
        description="POPIA-compliant privacy policy for Leadership by Design. Learn how we collect, use, and protect your personal information."
      />
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-lg max-w-none text-foreground/90 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
            <p>
              Leadership by Design ("we", "us", or "our") is committed to protecting your personal information
              in accordance with the Protection of Personal Information Act, 2013 (POPIA) of South Africa.
              This Privacy Policy explains how we collect, use, store, and protect your personal information
              when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">2. Responsible Party</h2>
            <p>
              The responsible party for the processing of your personal information is:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Business Name:</strong> Leadership by Design (Pty) Ltd</li>
              <li><strong>Country:</strong> South Africa</li>
              <li><strong>Website:</strong> leadershipbydesign.co.za</li>
              <li><strong>Contact:</strong> Available via our <a href="/contact" className="text-primary underline">Contact page</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">3. Personal Information We Collect</h2>
            <p>We may collect the following categories of personal information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Identity information:</strong> Name, surname, job title, company name</li>
              <li><strong>Contact information:</strong> Email address, phone number</li>
              <li><strong>Assessment data:</strong> Responses to our leadership diagnostics, team assessments, and coaching readiness tools</li>
              <li><strong>Communication data:</strong> Messages sent via contact forms, chat interactions, and newsletter subscriptions</li>
              <li><strong>Technical data:</strong> Browser type, IP address, pages visited, and cookies (via Google Tag Manager and analytics)</li>
              <li><strong>Transaction data:</strong> Purchase information for digital products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">4. Purpose of Processing</h2>
            <p>We process your personal information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide leadership coaching, training, and development services</li>
              <li>To deliver diagnostic results and personalised recommendations</li>
              <li>To respond to enquiries submitted via our contact forms</li>
              <li>To send newsletters and relevant content (with your consent)</li>
              <li>To process purchases of digital products and programmes</li>
              <li>To improve our website and services through analytics</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">5. Legal Basis for Processing</h2>
            <p>Under POPIA, we process your personal information based on one or more of the following grounds:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Consent:</strong> You have given us permission (e.g., subscribing to newsletters, completing assessments)</li>
              <li><strong>Contract:</strong> Processing is necessary to fulfil a service agreement</li>
              <li><strong>Legitimate interest:</strong> Processing is necessary for our legitimate business interests, provided your rights are not overridden</li>
              <li><strong>Legal obligation:</strong> Processing is required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">6. Sharing of Personal Information</h2>
            <p>We do not sell your personal information. We may share it with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Service providers:</strong> Hosting, email delivery, payment processing, and analytics platforms that assist us in operating our services</li>
              <li><strong>Professional partners:</strong> Where required to deliver coaching or training engagements you have opted into</li>
              <li><strong>Legal authorities:</strong> Where required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">7. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected,
              or as required by law. Diagnostic assessment data is retained to provide you with ongoing value and to improve our services.
              You may request deletion of your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">8. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal information against
              unauthorised access, alteration, disclosure, or destruction. These include encryption, secure hosting,
              and access controls.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">9. Cookies</h2>
            <p>
              Our website uses cookies and similar technologies (including Google Tag Manager) to enhance your experience
              and analyse website traffic. You can manage your cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">10. Your Rights Under POPIA</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to the processing of your personal information</li>
              <li>Withdraw consent at any time (where consent is the basis for processing)</li>
              <li>Lodge a complaint with the Information Regulator of South Africa</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">11. Information Regulator</h2>
            <p>
              If you are not satisfied with how we handle your personal information, you may lodge a complaint with:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>The Information Regulator (South Africa)</strong></li>
              <li>Website: <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-primary underline">inforegulator.org.za</a></li>
              <li>Email: complaints.IR@justice.gov.za</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
              effective date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">13. Contact Us</h2>
            <p>
              For any privacy-related enquiries or to exercise your rights, please contact us via our{" "}
              <a href="/contact" className="text-primary underline">Contact page</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
