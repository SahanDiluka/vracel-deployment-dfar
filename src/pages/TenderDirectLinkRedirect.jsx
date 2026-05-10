import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { tenderService } from "../services/tender_service";

export default function TenderDirectLinkRedirect() {
  const { id } = useParams();

  useEffect(() => {
    tenderService.getAllTenderDirectLinkPages().then((pages) => {
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