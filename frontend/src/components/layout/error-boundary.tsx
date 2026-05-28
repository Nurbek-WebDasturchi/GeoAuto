import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type State = { hasError: boolean };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="container flex min-h-screen flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-bold">Sahifada xatolik yuz berdi</h1>
          <p className="max-w-md text-muted-foreground">Iltimos, sahifani yangilang yoki keyinroq qayta urinib ko‘ring.</p>
          <Button onClick={() => location.reload()}>Yangilash</Button>
        </main>
      );
    }
    return this.props.children;
  }
}
