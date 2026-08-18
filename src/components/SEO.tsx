interface SEOProps {
  title: string;
  description: string;
  type?: string;
  url?: string;
  image?: string;
  jsonLd?: Record<string, any>;
}

export function SEO({ title, description, type = 'website', url, image, jsonLd }: SEOProps) {
  const siteName = 'مؤسسة الوليد للإنسانية';
  const fullTitle = `${title} | ${siteName}`;

  const origin = 'https://waleed-foundation.org';

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: origin,
    logo: 'https://res.cloudinary.com/wlkrtcrr/image/upload/v1784572343/logo_vkbiil.png',
    description: 'مؤسسة الوليد للإنسانية تعمل على دعم المبادرات والمشاريع الإنسانية في مختلف أنحاء العالم.',
  };

  const schema = jsonLd ? { ...defaultJsonLd, ...jsonLd } : defaultJsonLd;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
