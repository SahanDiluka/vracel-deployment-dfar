import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { officerService } from "../services/officer_service";

export default function OfficerDirectLinkRedirect() {
  const { id } = useParams();

  useEffect(() => {
    officerService.getAllOfficerDirectLinkPages().then((pages) => {
      const found = pages.find((p) => String(p.id) === String(id));
      if (found?.url) window.location.href = found.url;
    });
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 font-[Inter]">
      Redirecting…
    </div>
  );
}
