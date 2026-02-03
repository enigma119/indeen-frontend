import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getMentorBySlug } from '@/lib/api/search';
import { MentorProfile } from '@/components/mentors/profile';

interface MentorProfilePageProps {
  params: Promise<{ slug: string }>;
}

// Fetch mentor data
async function getMentor(slug: string) {
  try {
    return await getMentorBySlug(slug);
  } catch {
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: MentorProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const mentor = await getMentor(slug);

  if (!mentor) {
    return {
      title: 'Mentor non trouvé',
    };
  }

  const fullName = mentor.user
    ? `${mentor.user.firstName} ${mentor.user.lastName}`
    : 'Mentor';

  return {
    title: `${fullName} - Mentor Coran | Indeen`,
    description: mentor.headline,
    openGraph: {
      title: `${fullName} - Mentor Coran`,
      description: mentor.headline,
      images: mentor.user?.avatarUrl ? [mentor.user.avatarUrl] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullName} - Mentor Coran`,
      description: mentor.headline,
    },
  };
}

export default async function MentorProfilePage({
  params,
}: MentorProfilePageProps) {
  const { slug } = await params;
  const mentor = await getMentor(slug);

  if (!mentor) {
    notFound();
  }

  const fullName = mentor.user
    ? `${mentor.user.firstName} ${mentor.user.lastName}`
    : 'Mentor';

  // JSON-LD Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    description: mentor.headline,
    image: mentor.user?.avatarUrl,
    jobTitle: 'Mentor Coranique',
    aggregateRating: mentor.totalReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: mentor.averageRating,
      reviewCount: mentor.totalReviews,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
  };

  return (
    <>
      {/* JSON-LD for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 py-8">
          <MentorProfile mentor={mentor} />
        </div>
      </div>
    </>
  );
}
