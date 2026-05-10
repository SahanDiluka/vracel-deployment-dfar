import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { downloadService } from "../services/download_service";

export default function DownloadDirectLinkRedirect() {
  const { id } = useParams();

  useEffect(() => {
    downloadService.getAllDownloadDirectLinkPages().then((pages) => {
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