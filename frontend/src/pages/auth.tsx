import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Seo } from "@/components/layout/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { login, register } from "@/features/auth/auth-api";
import { regions } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const authSchema = z.object({
  email: z.string().email("Email manzilni to'g'ri kiriting."),
  password: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak."),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  region: z.string().optional()
});

type FormValues = z.infer<typeof authSchema>;

export const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<FormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { region: "Toshkent" }
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (mode === "login") return login({ email: values.email, password: values.password });
      return register({
        email: values.email,
        password: values.password,
        fullName: values.fullName!.trim(),
        phone: values.phone!.trim(),
        region: values.region!
      });
    },
    onMutate: () => {
      setSubmitError(null);
    },
    onSuccess: ({ data }) => {
      setSession(data.token, data.user);
      toast({ title: mode === "login" ? "Xush kelibsiz" : "Akkaunt yaratildi" });
      navigate("/");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "So'rov bajarilmadi.";
      setSubmitError(message);
      toast({
        title: mode === "login" ? "Kirish amalga oshmadi" : "Ro'yxatdan o'tish amalga oshmadi",
        description: message
      });
    }
  });

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);

    if (mode === "register") {
      let hasError = false;

      if (!values.fullName?.trim()) {
        form.setError("fullName", { message: "Ism familiyani kiriting." });
        hasError = true;
      }
      if (!values.phone?.trim()) {
        form.setError("phone", { message: "Telefon raqamni kiriting." });
        hasError = true;
      }
      if (!values.region) {
        form.setError("region", { message: "Regionni tanlang." });
        hasError = true;
      }

      if (hasError) {
        const message = "Ro'yxatdan o'tish uchun barcha maydonlarni to'ldiring.";
        setSubmitError(message);
        toast({ title: "Ma'lumot yetarli emas", description: message });
        return;
      }
    }

    mutation.mutate(values);
  };

  const onInvalid = () => {
    const message = "Email va parol ma'lumotlarini tekshiring.";
    setSubmitError(message);
    toast({ title: "Formani tekshiring", description: message });
  };

  const switchMode = () => {
    if (mutation.isPending) return;
    setSubmitError(null);
    form.clearErrors();
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <main className="container grid min-h-[calc(100vh-4rem)] place-items-center py-10">
      <Seo title="Kirish" description="GeoAuto Market akkauntiga kirish yoki ro'yxatdan o'tish." />
      <form className="w-full max-w-md rounded-lg border border-border p-6" onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <h1 className="text-2xl font-extrabold">{mode === "login" ? "Kirish" : "Ro'yxatdan o'tish"}</h1>
        <div className="mt-6 space-y-4">
          {submitError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              {submitError}
            </div>
          ) : null}

          {mode === "register" ? (
            <>
              <FieldError message={form.formState.errors.fullName?.message}>
                <Input placeholder="Ism familiya" {...form.register("fullName")} disabled={mutation.isPending} />
              </FieldError>
              <FieldError message={form.formState.errors.phone?.message}>
                <Input placeholder="+998 90 123 45 67" {...form.register("phone")} disabled={mutation.isPending} />
              </FieldError>
              <FieldError message={form.formState.errors.region?.message}>
                <Select {...form.register("region")} disabled={mutation.isPending}>
                  {regions.map((region) => (
                    <option key={region}>{region}</option>
                  ))}
                </Select>
              </FieldError>
            </>
          ) : null}

          <FieldError message={form.formState.errors.email?.message}>
            <Input type="email" placeholder="email@example.com" {...form.register("email")} disabled={mutation.isPending} />
          </FieldError>
          <FieldError message={form.formState.errors.password?.message}>
            <Input type="password" placeholder="Kamida 8 belgi" {...form.register("password")} disabled={mutation.isPending} />
          </FieldError>

          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "login" ? "Kirilmoqda..." : "Akkaunt yaratilmoqda..."}
              </>
            ) : (
              "Davom etish"
            )}
          </Button>
        </div>
        <button type="button" className="mt-4 text-sm font-semibold text-primary disabled:opacity-60" disabled={mutation.isPending} onClick={switchMode}>
          {mode === "login" ? "Yangi akkaunt yaratish" : "Akkauntim bor"}
        </button>
      </form>
    </main>
  );
};

const FieldError = ({ children, message }: { children: React.ReactNode; message?: string }) => (
  <label className="block">
    {children}
    {message ? <span className="mt-1 block text-xs font-medium text-destructive">{message}</span> : null}
  </label>
);
