import ClothAboutSection from '@/components/sections/ClothAboutSection';
import WorldHeroSection from '@/components/sections/WorldHeroSection';

export default function WorldPage() {
  return (
    <main style={{ background: '#111', minHeight: '100vh' }}>
      <WorldHeroSection />
      <ClothAboutSection />
    </main>
  );
}
