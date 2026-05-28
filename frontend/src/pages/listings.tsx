import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingMap } from "@/components/listings/listing-map";
import { ListingSkeleton } from "@/components/listings/listing-skeleton";
import { Seo } from "@/components/layout/seo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getListings } from "@/features/listings/listing-api";
import { useFavoriteListing } from "@/features/listings/use-favorite-listing";
import { regions } from "@/lib/utils";

export const ListingsPage = () => {
  const [filters, setFilters] = useState({ q: "", region: "", brand: "", minPrice: "", maxPrice: "", sort: "newest" });
  const query = useMemo(() => filters, [filters]);
  const { data, isLoading } = useQuery({ queryKey: ["listings", query], queryFn: () => getListings(query) });
  const favorite = useFavoriteListing();

  return (
    <main className="container py-6">
      <Seo title="E'lonlar" description="O'zbekiston bo'yicha avtomobil e'lonlarini qidirish va filterlash." />
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-extrabold">Avtomobillar</h1>
          <p className="mt-1 text-muted-foreground">Model, narx, region va masofa bo'yicha aniq qidiring.</p>
        </div>
        <Button variant="outline"><SlidersHorizontal className="h-4 w-4" /> Filterlar</Button>
      </div>
      <div className="grid gap-4 rounded-lg border border-border p-4 md:grid-cols-6">
        <Input className="md:col-span-2" placeholder="Cobalt, Gentra, Kia..." value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <Input placeholder="Brend" value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} />
        <Select value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })}>
          <option value="">Barcha regionlar</option>{regions.map((region) => <option key={region}>{region}</option>)}
        </Select>
        <Input type="number" placeholder="Min narx" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <Select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="newest">Yangi</option><option value="price_asc">Arzon avval</option><option value="price_desc">Qimmat avval</option><option value="mileage_asc">Kam probeg</option>
        </Select>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading ? Array.from({ length: 9 }).map((_, index) => <ListingSkeleton key={index} />) : null}
            {!isLoading && data?.data.map((listing) => <ListingCard key={listing.id} listing={listing} onFavorite={(id) => favorite.mutate(id)} />)}
          </div>
          {!isLoading && !data?.data.length ? <EmptyState title="E'lon topilmadi">Filterlarni yumshatib qayta urinib ko'ring.</EmptyState> : null}
        </section>
        <aside className="h-[520px] lg:sticky lg:top-20">
          <ListingMap listings={data?.data ?? []} />
        </aside>
      </div>
    </main>
  );
};
