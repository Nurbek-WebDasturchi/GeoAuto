import { Seo } from "@/components/layout/seo";
import { ListingForm } from "@/features/listings/listing-form";

export const AddCarPage = () => (
  <main className="container py-6">
    <Seo title="Avtomobil qo‘shish" description="Avtomobilingizni rasmlar, xarita va to‘liq ma’lumotlar bilan joylang." />
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold">E’lon berish</h1>
      <p className="mt-1 text-muted-foreground">Aniq ma’lumot va sifatli rasmlar e’lon ishonchini oshiradi.</p>
    </div>
    <ListingForm />
  </main>
);
