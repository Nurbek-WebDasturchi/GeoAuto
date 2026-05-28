import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { AddCarPage } from "@/pages/add-car";
import { AdminPage } from "@/pages/admin";
import { AuthPage } from "@/pages/auth";
import { EditCarPage } from "@/pages/edit-car";
import { FavoritesPage } from "@/pages/favorites";
import { HomePage } from "@/pages/home";
import { ListingDetailsPage } from "@/pages/listing-details";
import { ListingsPage } from "@/pages/listings";
import { MessagesPage } from "@/pages/messages";
import { NotFoundPage } from "@/pages/not-found";
import { ProfilePage } from "@/pages/profile";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/listings", element: <ListingsPage /> },
      { path: "/listings/:id", element: <ListingDetailsPage /> },
      { path: "/login", element: <AuthPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/add", element: <AddCarPage /> },
          { path: "/edit/:id", element: <EditCarPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/favorites", element: <FavoritesPage /> },
          { path: "/messages", element: <MessagesPage /> }
        ]
      },
      {
        element: <ProtectedRoute adminOnly />,
        children: [{ path: "/admin", element: <AdminPage /> }]
      },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);
