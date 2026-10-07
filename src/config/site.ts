interface PrivacySection {
  title: string;
  paragraphs: string[];
}

interface Privacy {
  status: 'pending' | 'published';
  effectiveDate: string;
  sections: PrivacySection[];
}

export const siteConfig = {
  site: {
    url: 'https://snovestudio.github.io',
    base: '/',
    language: 'ko',
    title: 'SnoveStudio | 일상에 닿는 모바일 앱',
    description: 'SnoveStudio는 스노베가 운영하는 모바일 앱 스튜디오입니다. 이미지를 태그로 정리하고 키보드에서 찾아 공유하는 MemeDraw를 개발하고 있습니다.',
    googleSiteVerification: 'bhxwy48DUPm-XecimBEhV5jgoSVuli6Ousq2LV7JC0o',
  },
  business: {
    brandName: 'SnoveStudio',
    registeredName: '스노베',
    registrationNumber: '717-27-01894',
    email: 'imagine.codes@gmail.com',
    relationship: 'SnoveStudio는 스노베가 운영하는 모바일 앱 브랜드입니다.',
  },
  service: {
    name: 'MemeDraw',
    description: '이미지를 검색 태그로 정리하고, 커스텀 키보드에서 빠르게 찾아 공유하는 모바일 앱입니다.',
    platforms: ['iOS', 'Android'],
    status: '개발 중',
  },
  privacy: {
    status: 'pending',
    effectiveDate: '',
    sections: [],
  } satisfies Privacy as Privacy,
};

const { site, business, privacy } = siteConfig;
const url = new URL(site.url);
if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
  throw new Error('site.url에는 경로 없는 HTTPS 주소를 입력하세요.');
}
if (site.base !== '/') throw new Error('base는 /여야 합니다.');
for (const [name, value] of Object.entries(business)) {
  if (!value.trim()) throw new Error(`사업자 설정이 비어 있습니다: ${name}`);
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email)) throw new Error('문의 이메일을 확인하세요.');
if (privacy.status === 'published') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(privacy.effectiveDate) || !privacy.sections.length) {
    throw new Error('정책 게시에는 확인된 본문과 적용일이 필요합니다.');
  }
  for (const section of privacy.sections) {
    if (!section.title.trim() || !section.paragraphs.length || section.paragraphs.some((text) => !text.trim())) {
      throw new Error('정책의 각 항목에 제목과 본문이 필요합니다.');
    }
  }
}

export const privacyLabel = privacy.status === 'published' ? '개인정보처리방침' : '개인정보 안내';
export const mailLink = `mailto:${business.email}`;
