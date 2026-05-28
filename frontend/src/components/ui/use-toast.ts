import { create } from "zustand";

export type Toast = { id: string; title: string; description?: string };

export const useToastStore = create<{
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}>((set) => ({
  toasts: [],
  toast: (toast) => set((state) => ({ toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }] })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
}));

export const toast = (input: Omit<Toast, "id">) => useToastStore.getState().toast(input);
