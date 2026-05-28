import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { regions } from "@/lib/utils";
import { createListing } from "./listing-api";

const schema = z.object({
  title: z.string().min(8),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.coerce.number().min(1970).max(new Date().getFullYear() + 1),
  priceUsd: z.coerce.number().positive(),
  mileageKm: z.coerce.number().min(0),
  region: z.string().min(2),
  district: z.string().min(2),
  address: z.string().optional(),
  latitude: z.coerce.number().min(37).max(46),
  longitude: z.coerce.number().min(55).max(74),
  fuelType: z.enum(["PETROL", "GAS", "HYBRID", "ELECTRIC", "DIESEL"]),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  bodyType: z.enum(["SEDAN", "HATCHBACK", "SUV", "COUPE", "WAGON", "PICKUP", "VAN", "MINIVAN"]),
  color: z.string().min(2),
  engineLiters: z.coerce.number().optional(),
  description: z.string().min(30),
  images: z.instanceof(FileList).optional()
});

type FormValues = z.infer<typeof schema>;

export const ListingForm = () => {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      region: "Toshkent",
      latitude: 41.3111,
      longitude: 69.2797,
      fuelType: "PETROL",
      transmission: "AUTOMATIC",
      bodyType: "SEDAN"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const data = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "images" || value === undefined) return;
        data.append(key, String(value));
      });
      Array.from(values.images ?? []).forEach((file) => data.append("images", file));
      return createListing(data);
    },
    onSuccess: ({ data }) => {
      toast({ title: "E’lon moderatsiyaga yuborildi", description: "Tasdiqlangandan keyin e’lonlar ro‘yxatida ko‘rinadi." });
      navigate(`/listings/${data.id}`);
    }
  });

  const useGps = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", Number(position.coords.latitude.toFixed(6)));
        form.setValue("longitude", Number(position.coords.longitude.toFixed(6)));
      },
      () => toast({ title: "GPS ishlamadi", description: "Brauzer ruxsatini tekshiring." })
    );
  };

  return (
    <form className="grid gap-6 lg:grid-cols-[1fr_360px]" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <div className="space-y-4">
        <Field label="Sarlavha" error={form.formState.errors.title?.message}>
          <Input {...form.register("title")} placeholder="Chevrolet Cobalt 2022, ideal holatda" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brend"><Input {...form.register("brand")} placeholder="Chevrolet" /></Field>
          <Field label="Model"><Input {...form.register("model")} placeholder="Cobalt" /></Field>
          <Field label="Yil"><Input type="number" {...form.register("year")} /></Field>
          <Field label="Narx, USD"><Input type="number" {...form.register("priceUsd")} /></Field>
          <Field label="Probeg"><Input type="number" {...form.register("mileageKm")} /></Field>
          <Field label="Dvigatel"><Input type="number" step="0.1" {...form.register("engineLiters")} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Yoqilg‘i">
            <Select {...form.register("fuelType")}>
              <option value="PETROL">Benzin</option><option value="GAS">Gaz</option><option value="HYBRID">Hybrid</option><option value="ELECTRIC">Elektr</option><option value="DIESEL">Dizel</option>
            </Select>
          </Field>
          <Field label="Uzatma">
            <Select {...form.register("transmission")}><option value="AUTOMATIC">Avtomat</option><option value="MANUAL">Mexanika</option></Select>
          </Field>
          <Field label="Kuzov">
            <Select {...form.register("bodyType")}>
              {["SEDAN", "HATCHBACK", "SUV", "COUPE", "WAGON", "PICKUP", "VAN", "MINIVAN"].map((item) => <option key={item} value={item}>{item}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Tavsif"><Textarea {...form.register("description")} placeholder="Holati, servis tarixi, komplektatsiya va kelishuv shartlari..." /></Field>
        <Field label="Rasmlar">
          <Controller
            control={form.control}
            name="images"
            render={({ field: { onChange } }) => <Input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(event) => onChange(event.target.files)} />}
          />
        </Field>
      </div>
      <aside className="space-y-4">
        <div className="rounded-lg border border-border p-4">
          <h2 className="font-semibold">Joylashuv</h2>
          <div className="mt-4 space-y-3">
            <Field label="Region">
              <Select {...form.register("region")}>{regions.map((region) => <option key={region}>{region}</option>)}</Select>
            </Field>
            <Field label="Tuman"><Input {...form.register("district")} /></Field>
            <Field label="Manzil"><Input {...form.register("address")} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Latitude"><Input type="number" step="0.000001" {...form.register("latitude")} /></Field>
              <Field label="Longitude"><Input type="number" step="0.000001" {...form.register("longitude")} /></Field>
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={useGps}>GPS orqali olish</Button>
          </div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <Field label="Rang"><Input {...form.register("color")} /></Field>
          <Button className="mt-4 w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Yuborilmoqda..." : "E’lonni yuborish"}
          </Button>
        </div>
      </aside>
    </form>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <label className="block text-sm font-medium">
    <span className="mb-2 block">{label}</span>
    {children}
    {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
  </label>
);
