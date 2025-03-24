"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Country } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface CountryCardProps {
  country: Country;
}

export function CountryCard({ country }: CountryCardProps) {
  const countrySlug = country.name.common
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <Link href={`/${countrySlug}`}>
      <Card className="h-full transition-transform hover:scale-105">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={country.flags.svg}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{country.name.common}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-muted-foreground">Region</dt>
              <dd>{country.region}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Population</dt>
              <dd>{country.population.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Capital</dt>
              <dd>{country.capital?.join(", ") || "N/A"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </Link>
  );
}
