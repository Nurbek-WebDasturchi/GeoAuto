import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Heart, MessageCircle, Share2, ShieldAlert } from "lucide-react";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingMap } from "@/components/listings/listing-map";
import { Seo } from "@/components/layout/seo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { favoriteListing, getListing, getSimilarListings, reportListing } from "@/features/listings/listing-api";
import { startConversation } from "@/features/messages/message-api";
import { formatKm, formatUsd } from "@/lib/utils";

export const ListingDetailsPage = () => {
  const { id = "" } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ["listing", id], queryFn: () => getListing(id), enabled: Boolean(id) });
  const { data: similar } = useQuery({ queryKey: ["similar", id], queryFn: () => getSimilarListings(id), enabled: Boolean(id) });
  const favorite = useMutation({ mutationFn: favoriteListing, onSuccess: () => toast({ title: "Sevimlilarga qo‘shildi" }) });
  const report = useMutation({ mutationFn: () => reportListing(id, "E’lon ma’lumotlari shubhali yoki noto‘g‘ri."), onSuccess: () => toast({ title: "Shikoyat yuborildi" }) });
  const message = useMutation({ mutationFn: () => startConversation(id, "Salom, e’loningiz bo‘yicha ma’lumot olmoqchiman."), onSuccess: () => toast({ title: "Xabar yuborildi" }) });

  if (isLoading) return <main className="container py-8"><Skeleton className="h-[420px] w-full" /></main>;
  if (!data?.data) return null;
  const listing = data.data;

  return (
    <main className="container py-6">
      <Seo title={listing.title} description={`${listing.brand} ${listing.model}, ${listing.year}, ${formatUsd(listing.priceUsd)}`} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {(listing.images.length ? listing.images : [{ id: "empty", url: "", path: "", sortOrder: 0 }]).map((image) => (
              <div key={image.id} className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                {image.url ? <img src={image.url} alt={listing.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground">Rasm yo‘q</div>}
              </div>
            ))}
          </div>
          <article>
            <h1 className="text-3xl font-extrabold">{listing.title}</h1>
            <p className="mt-3 text-3xl font-extrabold">{formatUsd(listing.priceUsd)}</p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              <Spec label="Yil" value={String(listing.year)} />
              <Spec label="Probeg" value={formatKm(listing.mileageKm)} />
              <Spec label="Yoqilg‘i" value={listing.fuelType} />
              <Spec label="Uzatma" value={listing.transmission} />
              <Spec label="Kuzov" value={listing.bodyType} />
              <Spec label="Rang" value={listing.color} />
            </dl>
            <p className="mt-6 whitespace-pre-line leading-7 text-slate-700">{listing.description}</p>
          </article>
          <div className="h-80"><ListingMap listings={[listing]} /></div>
        </section>
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-lg border border-border p-5">
            <h2 className="font-bold">{listing.owner.fullName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{listing.owner.region}</p>
            <a className="mt-4 block text-xl font-bold" href={`tel:${listing.owner.phone}`}>{listing.owner.phone}</a>
            <div className="mt-5 grid gap-2">
              <Button onClick={() => message.mutate()}><MessageCircle className="h-4 w-4" /> Yozish</Button>
              <Button variant="outline" onClick={() => favorite.mutate(listing.id)}><Heart className="h-4 w-4" /> Saqlash</Button>
              <Button variant="outline" onClick={() => navigator.share?.({ title: listing.title, url: location.href })}><Share2 className="h-4 w-4" /> Ulashish</Button>
              <Button variant="ghost" onClick={() => report.mutate()}><ShieldAlert className="h-4 w-4" /> Shikoyat</Button>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full"><Link to={`/edit/${listing.id}`}>E’lonni tahrirlash</Link></Button>
        </aside>
      </div>
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">O‘xshash e’lonlar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{similar?.data.map((item) => <ListingCard key={item.id} listing={item} />)}</div>
      </section>
    </main>
  );
};

const Spec = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border border-border p-3"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>
);
