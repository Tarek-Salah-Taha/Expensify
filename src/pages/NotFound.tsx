import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4">
          {t("pageNotFound")}
        </h1>

        {/* Message */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6">
          {t("oopsMessage")}
        </p>

        {/* Link */}
        <a
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
        >
          {t("returnHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
