import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/layout/seo";

export const NotFoundPage = () => (
  <main className="container grid min-h-[70vh] place-items-center text-center">
    <Seo title="404" description="Sahifa topilmadi." />
    <div>
      <h1 className="text-5xl font-extrabold">404</h1>
      <p className="mt-3 text-muted-foreground">Bunday sahifa topilmadi.</p>
      <Button asChild className="mt-6"><Link to="/">Bosh sahifa</Link></Button>
    </div>
  </main>
);
