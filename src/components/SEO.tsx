import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SITE_NAME = "Leadership by Design";
const DEFAULT_OG_IMAGE = "https://leadershipbydesign.co/og-image.jpg";
const SITE_URL = "https://leadershipbydesign.co";

export default function SEO({
  title,
  description,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  keywords,
  author = "Kevin Britz",
  publishedTime,
  modifiedTime,
}: SEOProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const fullCanonicalUrl = canonicalUrl ? `${SITE_URL}${canonicalUrl}` : undefined;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      
      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_ZA" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@LeadershipByDes" />
      <meta name="twitter:creator" content="@KevinBritz" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article specific (for blog posts) */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {ogType === "article" && <meta property="article:author" content={author} />}

      {/* Additional SEO */}
      <meta name="geo.region" content="ZA" />
      <meta name="geo.placename" content="South Africa" />
    </Helmet>
  );
}
