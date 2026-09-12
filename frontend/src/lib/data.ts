const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const DEFAULT_ABOUT = {
  greeting: 'Hi,',
  greetingSuffix: 'Myself',
  firstName: 'Yousuf',
  lastName: 'Hassan',
  roles: ['Competitive Programmer', 'Software Engineer', 'Programming Enthusiast', 'Ready to explore new things'],
  heroBio: 'I have a strong background in problem-solving through programming, data-structure and algorithms, competitive programming, and have experience in mentoring at University Programming Wing where I guide beginners in solving programming problems.',
  aboutText: 'I am currently pursuing a Bachelor of Science degree in Computer Science and Engineering at the International University of Business Agriculture and Technology(IUBAT).',
  email: 'yousufhassan04@gmail.com',
  resumeLink: 'https://drive.google.com/file/d/14l0fF6ctxpnQiwiYRSCDmKpo1uaSoYPx/view?usp=sharing',
  profileImage: '/images/myself.jpg',
  socials: {
    facebook: 'https://www.facebook.com/yousuf.hassan.7902/',
    linkedin: 'https://www.linkedin.com/in/yousuf-hassan-7902',
    github: 'https://github.com/yousuf7902/',
    email: 'yousufhassan04@gmail.com',
  },
};

export async function getAboutData() {
  try {
    const res = await fetch(`${API_URL}/about`, { cache: 'no-store' });
    if (!res.ok) return DEFAULT_ABOUT;
    return await res.json();
  } catch {
    return DEFAULT_ABOUT;
  }
}

export async function getSkillsData() {
  try {
    const res = await fetch(`${API_URL}/skills`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getProjectsData() {
  try {
    const res = await fetch(`${API_URL}/projects`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getAchievementsData() {
  try {
    const res = await fetch(`${API_URL}/achievements`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getExperiencesData() {
  try {
    const res = await fetch(`${API_URL}/experiences`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getCertificationsData() {
  try {
    const res = await fetch(`${API_URL}/certifications`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getWritingsData(
  options: { page?: number; limit?: number; tag?: string } = {}
) {
  const params = new URLSearchParams();
  if (options.page) params.set('page', String(options.page));
  if (options.limit) params.set('limit', String(options.limit));
  if (options.tag) params.set('tag', options.tag);
  const query = params.toString();

  const empty = {
    items: [],
    total: 0,
    totalPublished: 0,
    page: 1,
    pages: 1,
    limit: options.limit ?? 7,
    tagCounts: [],
  };

  try {
    const res = await fetch(
      `${API_URL}/writings${query ? `?${query}` : ''}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return empty;
    const data = await res.json();

    return Array.isArray(data)
      ? { ...empty, items: data, total: data.length, totalPublished: data.length }
      : data;
  } catch {
    return empty;
  }
}

export async function getWritingBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/writings/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
