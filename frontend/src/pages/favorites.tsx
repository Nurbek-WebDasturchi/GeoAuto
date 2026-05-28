import { useQuery } from "@tanstack/react-query";
import { ListingCard } from "@/components/listings/listing-card";
import { Seo } from "@/components/layout/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { getFavorites } from "@/features/listings/listing-api";

export const FavoritesPage = () => {
  const { data } = useQuery({ queryKey: ["favorites"], queryFn: getFavorites });
  return (
    <main className="container py-6">
      <Seo title="Sevimlilar" description="Saqlangan avtomobil e’lonlari ro‘yxati." />
      <h1 className="text-3xl font-extrabold">Sevimlilar</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data?.data.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
      </div>
      {data && data.data.length === 0 ? <EmptyState title="Hali saqlangan e’lon yo‘q">Yoqtirgan avtomobillaringizni yurak belgisi orqali saqlang.</EmptyState> : null}
    </main>
  );
};
