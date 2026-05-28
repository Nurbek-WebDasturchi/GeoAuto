import { Eye, Gauge, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Listing } from "@/lib/types";
import { formatKm, formatUsd } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const ListingCard = ({ listing, onFavorite }: { listing: Listing; onFavorite?: (id: string) => void }) => {
  const image = listing.images[0]?.url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-lg border border-border bg-white"
    >
      <Link to={`/listings/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] bg-muted">
          {image ? (
            <img src={image} alt={listing.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Rasm yuklanmagan</div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            {listing.isTop ? <span className="rounded bg-foreground px-2 py-1 text-xs font-semibold text-white">TOP</span> : null}
            {listing.isPremium ? <span className="rounded bg-accent px-2 py-1 text-xs font-semibold text-white">Premium</span> : null}
          </div>
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <Link to={`/listings/${listing.id}`} className="line-clamp-1 font-semibold hover:text-primary">
            {listing.title}
          </Link>
          <p className="mt-1 text-xl font-extrabold">{formatUsd(listing.priceUsd)}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <span>{listing.year}</span>
          <span className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            {formatKm(listing.mileageKm)}
          </span>
          <span className="col-span-2 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {listing.region}, {listing.district}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-4 w-4" />
            {listing.viewCount}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onFavorite?.(listing.id);
            }}
            aria-label="Sevimliga qo'shish"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
};
