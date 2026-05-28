import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/layout/seo";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingSkeleton } from "@/components/listings/listing-skeleton";
import { getListings } from "@/features/listings/listing-api";

export const HomePage = () => {
  const { data, isLoading } = useQuery({ queryKey: ["home-listings"], queryFn: () => getListings({ limit: 8 }) });

  return (
    <main>
      <Seo title="O‘zbekistonda avtomobil bozori" description="Xarita, filtrlar va xavfsiz chat bilan ishlatilgan avtomobillar marketplace." />
      <section className="border-b border-border">
        <div className="container grid gap-8 py-10 md:grid-cols-[1.1fr_0.9fr] md:py-16">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase text-primary">GeoAuto Market</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
              O‘zbekistonda avtomobilni yaqin joydan toping.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Verified e’lonlar, xaritada joylashuv, seller bilan chat va kuchli filtrlar bitta minimal platformada.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/listings">
                  <Search className="h-5 w-5" />
                  Avtomobil qidirish
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/add">
                  E’lon berish
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid content-end gap-3 rounded-lg border border-border p-4">
            <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
                alt="Premium avtomobil"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <Metric icon={<MapPin className="h-4 w-4" />} label="GPS filter" />
              <Metric icon={<ShieldCheck className="h-4 w-4" />} label="Moderatsiya" />
              <Metric icon={<Search className="h-4 w-4" />} label="Live search" />
            </div>
          </div>
        </div>
      </section>
      <section className="container py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Yangi e’lonlar</h2>
            <p className="mt-1 text-muted-foreground">Faol e’lonlar ro‘yxati, premium va TOP avval ko‘rinadi.</p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex"><Link to="/listings">Barchasi</Link></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => <ListingSkeleton key={index} />)
            : data?.data.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      </section>
    </main>
  );
};

const Metric = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center justify-center gap-2 rounded-md bg-muted px-2 py-3 font-semibold">{icon}{label}</div>
);
