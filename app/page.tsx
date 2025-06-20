import PageNav from '@/components/PageNav/PageNav';

export default function Home() {
  const defaultPages = [
    { id: 'info-tab', title: 'Info' },
    { id: 'details-tab', title: 'Details' },
    { id: 'other-tab', title: 'Other' },
    { id: 'ending-tab', title: 'Ending' },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <PageNav defaultPages={defaultPages} />
    </main>
  );
}
