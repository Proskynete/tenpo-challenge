import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { MovieList } from "../components/MovieList";
import { Button } from "@/components/ui/button";

export const Home = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, we might want to redirect to login
      // or show an error message. For now, we just log the error.
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 grid">
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("movies.title")}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t("movies.browsePopular")}
              </p>
            </div>

            <img src="/tenpo.png" alt="Logo" className="h-8" />

            <Button size="sm" variant="destructive" onClick={handleLogout}>
              {t("auth.logout")}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        <MovieList />
      </main>
    </div>
  );
};
