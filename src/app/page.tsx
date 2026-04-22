import FlappyBirdGame from '@/components/FlappyBirdGame';

export default function Home() {
  return (
    <main className="w-screen h-screen bg-[#2c3e50] flex items-center justify-center overflow-hidden font-[family-name:var(--font-geist-sans)]">
      <FlappyBirdGame />
    </main>
  );
}
