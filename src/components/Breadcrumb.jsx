import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";

export default function Breadcrumb({section}) {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const last = segments[segments.length - 1];

  return (
   <nav className="hidden md:flex items-center gap-2 text-sm py-3 px-6 font-sans">
      {/* Home — always first */}
      <Link to="/" className="flex items-center gap-1 text-gray-300 hover:underline">
        <FaHome className="text-sm" />
        Home
      </Link>

      {section && (
        <>
          <FaChevronRight className="text-gray-300 text-xs" />
          <span className="text-gray-300 font-semibold capitalize">
            {section}
          </span>
        </>
      )}

      {/* Last segment */}
      {last && (
        <>
          <FaChevronRight className="text-gray-300 text-xs" />
          <span className="text-gray-300 font-semibold capitalize">
            {last?.replace(/-/g, " ").replace(/%20/g, " ")}
          </span>
        </>
      )}

    </nav>
  );
}