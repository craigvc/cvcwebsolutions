import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import getPayloadClient from '@/payload/payloadClient';
import HeroCustomizable from '@/components/HeroCustomizable';
import CTACustomizable from '@/components/CTACustomizable';

interface PageData {
  id: string;
  title: string;
  slug: string;
  hero?: {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: any;
  };
  content?: any; // richText field
  sections?: Array<{
    id?: string;
    sectionType: string;
    title?: string;
    subtitle?: string;
    content?: any;
    image?: any;
    imagePosition?: 'left' | 'right';
    features?: Array<any>;
    buttonText?: string;
    buttonLink?: string;
    faqs?: Array<any>;
    stats?: Array<any>;
    testimonials?: Array<any>;
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogImage?: any;
  };
  status?: 'draft' | 'published';
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const payload = await getPayloadClient();
  
  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: params.slug,
        },
        status: {
          equals: 'published',
        },
      },
      limit: 1,
    });

    const page = docs[0] as PageData | undefined;

    if (!page) {
      return {
        title: 'Page Not Found',
      };
    }

    return {
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription || page.hero?.subheadline,
      keywords: page.seo?.metaKeywords,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'CVC Web Solutions',
    };
  }
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const payload = await getPayloadClient();
  
  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: params.slug,
        },
        status: {
          equals: 'published',
        },
      },
      limit: 1,
    });

    const page = docs[0] as PageData | undefined;

    if (!page) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        {(page.hero?.headline || page.hero?.subheadline) && (
          <HeroCustomizable
            title={page.hero.headline || page.title}
            subtitle={page.hero.subheadline || ''}
            showFeatures={false}
            showButtons={false}
          />
        )}

        {/* Main Content */}
        {page.content && typeof page.content === 'string' && (
          <div className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </div>
        )}

        {/* Dynamic Sections */}
        {page.sections && page.sections.length > 0 && (
          <div>
            {page.sections.map((section, index) => (
              <div key={section.id || index} className="px-4 py-16 sm:px-6 lg:px-8">
                {section.sectionType === 'textBlock' && section.content && (
                  <div className="max-w-4xl mx-auto">
                    <div 
                      className="prose prose-lg dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                )}

                {section.sectionType === 'cta' && (
                  <CTACustomizable
                    title={section.title || 'Ready to Get Started?'}
                    subtitle={section.subtitle || 'Let\'s build something amazing together'}
                  />
                )}

                {section.sectionType === 'featureCards' && section.features && (
                  <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                      {section.title && (
                        <h2 className="mb-4 text-3xl font-bold text-foreground">{section.title}</h2>
                      )}
                      {section.subtitle && (
                        <p className="text-lg text-muted-foreground">{section.subtitle}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {section.features.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="p-6 rounded-lg shadow-md bg-card">
                          <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section.sectionType === 'stats' && section.stats && (
                  <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                      {section.stats.map((item: any, itemIndex: number) => (
                        <div key={itemIndex}>
                          <div className="mb-2 text-4xl font-bold text-primary">{item.value}</div>
                          <div className="text-muted-foreground">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section.sectionType === 'faq' && section.faqs && (
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-12 text-center">
                      {section.title && (
                        <h2 className="mb-4 text-3xl font-bold text-foreground">{section.title}</h2>
                      )}
                    </div>
                    <div className="space-y-6">
                      {section.faqs.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="p-6 rounded-lg bg-card">
                          <h3 className="mb-2 text-lg font-semibold">{item.question}</h3>
                          <p className="text-muted-foreground">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section.sectionType === 'testimonials' && section.testimonials && (
                  <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                      {section.title && (
                        <h2 className="mb-4 text-3xl font-bold text-foreground">{section.title}</h2>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {section.testimonials.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="p-6 rounded-lg shadow-md bg-card">
                          <p className="mb-4 italic text-muted-foreground">"{item.quote}"</p>
                          <div>
                            <div className="font-semibold">{item.author}</div>
                            {item.role && (
                              <div className="text-sm text-muted-foreground">{item.role}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Default CTA if no sections */}
        {(!page.sections || page.sections.length === 0) && (
          <CTACustomizable />
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching page:', error);
    notFound();
  }
}

// Disable static generation at build time
// Pages will be generated on-demand (ISR)
export const dynamicParams = true;
