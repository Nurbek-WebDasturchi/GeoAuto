import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { Button } from "./button";
import { useToastStore } from "./use-toast";

export const Toaster = () => {
  const { toasts, dismiss } = useToastStore();

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((item) => (
        <ToastPrimitive.Root
          key={item.id}
          className="grid w-[calc(100vw-2rem)] max-w-sm grid-cols-[1fr_auto] gap-2 rounded-md border border-border bg-white p-4 text-sm"
          duration={4500}
          onOpenChange={(open) => {
            if (!open) dismiss(item.id);
          }}
        >
          <div>
            <ToastPrimitive.Title className="font-semibold">{item.title}</ToastPrimitive.Title>
            {item.description ? (
              <ToastPrimitive.Description className="mt-1 text-muted-foreground">
                {item.description}
              </ToastPrimitive.Description>
            ) : null}
          </div>
          <ToastPrimitive.Close asChild>
            <Button variant="ghost" size="sm" aria-label="Yopish">
              <X className="h-4 w-4" />
            </Button>
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" />
    </ToastPrimitive.Provider>
  );
};
