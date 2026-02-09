import { Helmet } from "react-helmet";

const SITE_URL = "https://leadershipbydesign.co";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Leadership by Design",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description: "Executive coaching and leadership development for managers and senior leaders in South Africa.",
    foundingDate: "2014",
    founder: {
      "@type": "Person",
      name: "Kevin Britz",
      jobTitle: "Executive Coach",
      url: `${SITE_URL}/about`,
    },
    areaServed: {
      "@type": "Country",
      name: "South Africa",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+27-84-414-1852",
      contactType: "customer service",
      email: "kevin@kevinbritz.com",
      areaServed: "ZA",
      availableLanguage: "English",
    },
    sameAs: [
      "https://www.linkedin.com/company/leadership-by-design-sa",
      "https://www.linkedin.com/in/kevinbritz",
    ],
    knowsAbout: [
      "Executive Coaching",
      "Leadership Development",
      "Team Workshops",
      "SHIFT Methodology",
      "Contagious Identity",
      "Human Performance Systems",
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
