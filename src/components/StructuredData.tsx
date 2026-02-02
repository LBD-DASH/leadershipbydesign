import { Helmet } from "react-helmet";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  authorName: string;
  publishedTime: string;
  modifiedTime?: string;
  url: string;
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  url: string;
}

interface CourseSchemaProps {
  name: string;
  description: string;
  provider?: string;
  duration?: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

const SITE_URL = "https://leadershipbydesign.co";
const ORGANIZATION = {
  "@type": "Organization",
  name: "Leadership by Design",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
};

export function ArticleSchema({
  title,
  description,
  image,
  authorName,
  publishedTime,
  modifiedTime,
  url,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || `${SITE_URL}/og-image.jpg`,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: ORGANIZATION,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${url}`,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function ServiceSchema({
  name,
  description,
  provider = "Leadership by Design",
  areaServed = "South Africa",
  url,
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
      url: SITE_URL,
    },
    areaServed,
    url: `${SITE_URL}${url}`,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function CourseSchema({
  name,
  description,
  provider = "Leadership by Design",
  duration,
  url,
}: CourseSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
      url: SITE_URL,
    },
    ...(duration && { timeRequired: duration }),
    url: `${SITE_URL}${url}`,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function WebApplicationSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${SITE_URL}${url}`,
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ZAR",
    },
    provider: ORGANIZATION,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function EventSchema({
  name,
  description,
  url,
  duration,
  eventAttendanceMode = "OfflineEventAttendanceMode",
}: {
  name: string;
  description: string;
  url: string;
  duration?: string;
  eventAttendanceMode?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    url: `${SITE_URL}${url}`,
    eventAttendanceMode: `https://schema.org/${eventAttendanceMode}`,
    organizer: ORGANIZATION,
    ...(duration && { duration }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
