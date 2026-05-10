// src/pages/DirectLinkRedirect.jsx
// This page is never rendered — clicking a direct_link nav item in AppBar
// opens the external URL directly. This file is just a safety fallback
// in case someone lands on /page/direct/:id.

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { cmsService } from "../services/information_service";

export default function DirectLinkRedirect() {
  const { id } = useParams();

  useEffect(() => {
    cmsService.getAllDirectLinkPages().then((pages) => {
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
