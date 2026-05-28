import { Helmet } from "react-helmet-async";

export const Seo = ({ title, description }: { title: string; description: string }) => (
  <Helmet>
    <title>{title} | GeoAuto Market</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={`${title} | GeoAuto Market`} />
    <meta property="og:description" content={description} />
  </Helmet>
);
