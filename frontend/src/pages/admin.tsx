import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Seo } from "@/components/layout/seo";
import { Button } from "@/components/ui/button";
import { getDashboard, moderateListing } from "@/features/admin/admin-api";

export const AdminPage = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-dashboard"], queryFn: getDashboard });
  const moderate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "REJECTED" | "SOLD" }) => moderateListing(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] })
  });

  const stats = data?.data;
  return (
    <main className="container py-6">
      <Seo title="Admin dashboard" description="E’lon moderatsiyasi va marketplace analitikasi." />
      <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Users" value={stats?.users ?? 0} />
        <Stat label="Active" value={stats?.activeListings ?? 0} />
        <Stat label="Pending" value={stats?.pendingListings ?? 0} />
        <Stat label="Sold" value={stats?.soldListings ?? 0} />
        <Stat label="Reports" value={stats?.reports ?? 0} />
      </div>
      <section className="mt-8">
        <h2 className="text-xl font-bold">Oxirgi e’lonlar</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          {stats?.latestListings.map((listing) => (
            <div key={listing.id} className="grid gap-3 border-b border-border p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="font-semibold">{listing.title}</h3>
                <p className="text-sm text-muted-foreground">{listing.status} · {listing.region}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => moderate.mutate({ id: listing.id, status: "ACTIVE" })}>Tasdiqlash</Button>
                <Button size="sm" variant="outline" onClick={() => moderate.mutate({ id: listing.id, status: "REJECTED" })}>Rad etish</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg border border-border p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p></div>
);
