import { useQuery } from "@tanstack/react-query";
import { Seo } from "@/components/layout/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { me } from "@/features/auth/auth-api";
import { useAuthStore } from "@/stores/auth-store";

export const ProfilePage = () => {
  const storeUser = useAuthStore((state) => state.user);
  const { data, isLoading } = useQuery({ queryKey: ["me"], queryFn: me });
  const user = data?.data ?? storeUser;

  return (
    <main className="container py-6">
      <Seo title="Profil" description="Foydalanuvchi profili va akkaunt ma’lumotlari." />
      <h1 className="text-3xl font-extrabold">Profil</h1>
      {isLoading ? <Skeleton className="mt-6 h-48 w-full max-w-xl" /> : null}
      {user ? (
        <div className="mt-6 max-w-xl rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <dl className="mt-5 grid gap-3 text-sm">
            <Row label="Email" value={user.email} />
            <Row label="Telefon" value={user.phone} />
            <Row label="Region" value={user.region} />
            <Row label="Rol" value={user.role} />
          </dl>
        </div>
      ) : null}
    </main>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b border-border pb-2"><dt className="text-muted-foreground">{label}</dt><dd className="font-semibold">{value}</dd></div>
);
