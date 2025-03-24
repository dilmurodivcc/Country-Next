import { Country } from "@/lib/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

async function getCountries(): Promise<Country[]> {
  const res = await fetch("https://restcountries.com/v3.1/all", {
    next: { revalidate: 86400 }, // Revalidate once per day
  });

  if (!res.ok) {
    throw new Error("Failed to fetch countries");
  }

  return res.json();
}

export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((country) => ({
    country: encodeURIComponent(country.name.common.toLowerCase()),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { country: string };
}) {
  const countries = await getCountries();
  const country = countries.find(
    (c) => encodeURIComponent(c.name.common.toLowerCase()) === params.country
  );

  if (!country) {
    return {
      title: "Country Not Found",
    };
  }

  return {
    title: `${country.name.common} - Countries Explorer`,
    description: `Learn about ${country.name.common}, including its capital, population, languages, and more.`,
  };
}

export default async function CountryPage({
  params,
}: {
  params: { country: string };
}) {
  const countries = await getCountries();
  const country = countries.find(
    (c) => encodeURIComponent(c.name.common.toLowerCase()) === params.country
  );

  if (!country) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Countries
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={country.flags.svg}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{country.name.official}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">Population</dt>
                <dd className="text-lg">
                  {country.population.toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-muted-foreground">Region</dt>
                <dd className="text-lg">{country.region}</dd>
              </div>

              {country.capital && (
                <div>
                  <dt className="text-sm text-muted-foreground">Capital</dt>
                  <dd className="text-lg">{country.capital.join(", ")}</dd>
                </div>
              )}

              {country.currencies && (
                <div>
                  <dt className="text-sm text-muted-foreground">Currencies</dt>
                  <dd className="text-lg">
                    {Object.values(country.currencies)
                      .map(
                        (currency) => `${currency.name} (${currency.symbol})`
                      )
                      .join(", ")}
                  </dd>
                </div>
              )}

              {country.languages && (
                <div>
                  <dt className="text-sm text-muted-foreground">Languages</dt>
                  <dd className="text-lg">
                    {Object.values(country.languages).join(", ")}
                  </dd>
                </div>
              )}

              {country.timezones && (
                <div>
                  <dt className="text-sm text-muted-foreground">Timezones</dt>
                  <dd className="text-lg">{country.timezones.join(", ")}</dd>
                </div>
              )}

              {country.borders && (
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Bordering Countries
                  </dt>
                  <dd className="flex flex-wrap gap-2">
                    {country.borders.map((border) => {
                      const borderCountry = countries.find(
                        (c) => c.cca3 === border
                      );
                      if (!borderCountry) return null;
                      return (
                        <Link
                          key={border}
                          href={`/${encodeURIComponent(
                            borderCountry.name.common.toLowerCase()
                          )}`}
                          className="rounded-full bg-secondary px-3 py-1 text-sm"
                        >
                          {borderCountry.name.common}
                        </Link>
                      );
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
