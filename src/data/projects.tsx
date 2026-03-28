export interface Project {
  id: number;
  title: string;
  description: string;
  caseStudy?: React.ReactNode;
  tags: string[];
  image: string;
  link: string;
  color: string;
  rotate: number;
  xOffset: number;
  yOffset: number;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Smart Locker Self-Service',
    description: 'Smart locker self-service system built for scalable deployment across public spaces, offices, and commercial environments.',
    caseStudy: (
      <>
        <b>Role:</b> Frontend Engineer<br />
        <b>Challenge:</b> Building a reliable real-time interface for IoT-based lockers, ensuring seamless communication between cloud services and physical hardware.<br />
        <b>Outcome:</b> Delivered a production-ready smart locker system deployed in transportation hubs, enabling thousands of self-service transactions daily.
      </>
    ),
    tags: ['React.js', 'TailwindCSS'],
    image: '/collage/locker.png',
    link: 'https://multidaya.id/business/lockerin',
    color: 'var(--accent-sage)',
    rotate: -5,
    xOffset: -10,
    yOffset: -5,
  },
  {
    id: 2,
    title: 'Company Profile Website',
    description: 'Company profile website for PT. Multidaya Dinamika.',
    caseStudy: (
      <>
        <b>Role:</b> Fullstack Developer<br />
        <b>Challenge:</b> Creating a modern, dynamic identity for a corporate holding.<br />
        <b>Outcome:</b> Increased organic traffic and better brand positioning.
      </>
    ),
    tags: ['React', 'TailwindCSS', 'CMS Strapi'],
    image: '/collage/company-profile.png',
    link: 'https://multidaya.id',
    color: 'var(--accent-rust)',
    rotate: 8,
    xOffset: 15,
    yOffset: 10,
  },
  {
    id: 3,
    title: 'Ticketing Booking System',
    description: 'Online-Onsite Ticketing and Point of Sales System.',
    caseStudy: (
      <>
        <b>Role:</b> Fullstack Developer<br />
        <b>Challenge:</b> Handling high concurrency during peak ticket sales.<br />
        <b>Outcome:</b> Processed 10,000+ tickets flawlessly on launch day.
      </>
    ),
    tags: ['React', 'TailwindCSS', 'CMS Strapi'],
    image: '/collage/dolanapp.png',
    link: 'https://dolanapp.com',
    color: 'var(--accent-sepia)',
    rotate: 12,
    xOffset: -20,
    yOffset: 15,
  },
  {
    id: 4,
    title: 'Parkour Parking Solution',
    description: 'Integrated Parking Ecosystem with Cashless Payment.',
    caseStudy: (
      <>
        <b>Role:</b> Backend Engineer<br />
        <b>Challenge:</b> Services integration with hardware barriers and ALPR cameras.<br />
        <b>Outcome:</b> Deployed in multiple enterprise smart buildings and tourist attractions.
      </>
    ),
    tags: ['Laravel', 'Golang'],
    image: '/collage/parkour.png',
    link: 'https://multidaya.id/solution/parkour',
    color: 'var(--accent-warm)',
    rotate: -9,
    xOffset: 25,
    yOffset: -10,
  },
];
