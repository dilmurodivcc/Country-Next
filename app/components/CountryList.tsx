"use client";

import { Country, SortOption } from "@/lib/types";
import { CountryCard } from "./CountryCard";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface CountryListProps {
  countries: Country[];
}

export function CountryList({ countries }: CountryListProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [region, setRegion] = useState<string>("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const regions = Array.from(
    new Set(countries.map((country) => country.region))
  );

  const filteredCountries = countries
    .filter(
      (country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase()) &&
        (region === "all" || country.region === region)
    )
    .sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.common.localeCompare(b.name.common);
        case "name-desc":
          return b.name.common.localeCompare(a.name.common);
        case "population-asc":
          return a.population - b.population;
        case "population-desc":
          return b.population - a.population;
        default:
          return 0;
      }
    });

  const paginatedCountries = filteredCountries.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [search, sort, region]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          placeholder="Search countries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(value) => setSort(value as SortOption)}
        >
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="population-asc">
              Population (Low-High)
            </SelectItem>
            <SelectItem value="population-desc">
              Population (High-Low)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedCountries.map((country) => (
          <CountryCard key={country.name.common} country={country} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          >
            <IoIosArrowBack className="h-5 w-5" />
          </button>
          <span className="flex items-center">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          >
            <IoIosArrowForward className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
