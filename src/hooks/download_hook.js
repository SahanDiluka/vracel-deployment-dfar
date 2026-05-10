import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import { downloadService } from "../services/download_service";

export function useDownloadNavbar() {
  const language = useSelector(selectLanguage);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    downloadService.getDownloadNavbar(language)
      .then(setItems)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [language]);

  return { items, loading, error };
}

export function useDownloadLinkTablePage(slug) {
  const language = useSelector(selectLanguage);
  const [page, setPage]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    downloadService.getDownloadLinkTablePageBySlug(slug, language)
      .then(setPage)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug, language]);

  return { page, loading, error };
}

export function useDownloadNormalPage(slug) {
  const language = useSelector(selectLanguage);
  const [page, setPage]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    downloadService.getDownloadNormalPageBySlug(slug, language)
      .then(setPage)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug, language]);

  return { page, loading, error };
}