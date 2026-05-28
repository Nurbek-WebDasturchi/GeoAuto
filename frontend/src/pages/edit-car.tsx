import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Seo } from "@/components/layout/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getListing, updateListing } from "@/features/listings/listing-api";
import { regions } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(8),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.coerce.number().min(1970),
  priceUsd: z.coerce.number().positive(),
  mileageKm: z.coerce.number().min(0),
  region: z.string().min(2),
  district: z.string().min(2),
  address: z.string().optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  fuelType: z.enum(["PETROL", "GAS", "HYBRID", "ELECTRIC", "DIESEL"]),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  bodyType: z.enum(["SEDAN", "HATCHBACK", "SUV", "COUPE", "WAGON", "PICKUP", "VAN", "MINIVAN"]),
  color: z.string().min(2),
  engineLiters: z.coerce.number().optional(),
  description: z.string().min(30)
});

type FormValues = z.infer<typeof schema>;

export const EditCarPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ["listing", id], queryFn: () => getListing(id), enabled: Boolean(id) });
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const mutation = useMutation({
    mutationFn: (values: FormValues) => updateListing(id, values),
    onSuccess: ({ data }) => {
      toast({ title: "E’lon yangilandi", description: "Moderatsiyadan keyin qayta faol bo‘ladi." });
      navigate(`/listings/${data.id}`);
    }
  });

  useEffect(() => {
    if (data?.data) {
      const listing = data.data;
      form.reset({
        title: listing.title,
        brand: listing.brand,
        model: listing.model,
        year: listing.year,
        priceUsd: listing.priceUsd,
        mileageKm: listing.mileageKm,
        region: listing.region,
        district: listing.district,
        address: listing.address,
        latitude: Number(listing.latitude),
        longitude: Number(listing.longitude),
        fuelType: listing.fuelType,
        transmission: listing.transmission,
        bodyType: listing.bodyType,
        color: listing.color,
        engineLiters: listing.engineLiters ? Number(listing.engineLiters) : undefined,
        description: listing.description
      });
    }
  }, [data, form]);

  return (
    <main className="container py-6">
      <Seo title="E’lonni tahrirlash" description="Avtomobil e’loni ma’lumotlarini yangilash." />
      <h1 className="text-3xl font-extrabold">E’lonni tahrirlash</h1>
      <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <Input {...form.register("title")} placeholder="Sarlavha" />
        <Input {...form.register("brand")} placeholder="Brend" />
        <Input {...form.register("model")} placeholder="Model" />
        <Input type="number" {...form.register("year")} placeholder="Yil" />
        <Input type="number" {...form.register("priceUsd")} placeholder="Narx" />
        <Input type="number" {...form.register("mileageKm")} placeholder="Probeg" />
        <Select {...form.register("region")}>{regions.map((region) => <option key={region}>{region}</option>)}</Select>
        <Input {...form.register("district")} placeholder="Tuman" />
        <Input {...form.register("address")} placeholder="Manzil" />
        <Input {...form.register("color")} placeholder="Rang" />
        <Input type="number" step="0.000001" {...form.register("latitude")} placeholder="Latitude" />
        <Input type="number" step="0.000001" {...form.register("longitude")} placeholder="Longitude" />
        <Select {...form.register("fuelType")}><option value="PETROL">Benzin</option><option value="GAS">Gaz</option><option value="HYBRID">Hybrid</option><option value="ELECTRIC">Elektr</option><option value="DIESEL">Dizel</option></Select>
        <Select {...form.register("transmission")}><option value="AUTOMATIC">Avtomat</option><option value="MANUAL">Mexanika</option></Select>
        <Select {...form.register("bodyType")}>{["SEDAN", "HATCHBACK", "SUV", "COUPE", "WAGON", "PICKUP", "VAN", "MINIVAN"].map((item) => <option key={item} value={item}>{item}</option>)}</Select>
        <Input type="number" step="0.1" {...form.register("engineLiters")} placeholder="Dvigatel" />
        <Textarea className="lg:col-span-2" {...form.register("description")} />
        <Button className="lg:col-span-2" disabled={mutation.isPending}>{mutation.isPending ? "Saqlanmoqda..." : "Saqlash"}</Button>
      </form>
    </main>
  );
};
