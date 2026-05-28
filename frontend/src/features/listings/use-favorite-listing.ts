import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { favoriteListing, unfavoriteListing } from "@/features/listings/listing-api";
import { useAuthStore } from "@/stores/auth-store";

export const useFavoriteListing = (options: { remove?: boolean } = {}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) {
        navigate("/login");
        throw new Error("Sevimliga qo'shish uchun avval tizimga kiring.");
      }

      return options.remove ? unfavoriteListing(id) : favoriteListing(id);
    },
    onSuccess: () => {
      toast({ title: options.remove ? "Sevimlilardan olib tashlandi" : "Sevimlilarga qo'shildi" });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["home-listings"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "So'rov bajarilmadi.";
      toast({ title: "Amal bajarilmadi", description: message });
    }
  });
};
