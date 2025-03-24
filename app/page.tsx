import { Country } from '@/lib/types';
import { CountryList } from './components/CountryList';

async function getCountries(): Promise<Country[]> {
  const res = await fetch('https://restcountries.com/v3.1/all', {
    next: { revalidate: 86400 }, // Revalidate once per day
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch countries');
  }

  return res.json();
}

export default async function Home() {
  const countries = await getCountries();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Explore Countries</h1>
      <CountryList countries={countries} />
    </main>
  );
}