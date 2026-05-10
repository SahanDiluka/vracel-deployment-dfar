import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import { tenderService } from "../services/tender_service";

export function useTenderNavbar() {
  const language = useSelector(selectLanguage);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    tenderService
      .getTenderNavbar(language)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [language]);

  return { items, loading };
}

export function useTenderLinkTablePage(slug) {
  const language = useSelector(selectLanguage);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    tenderService
      .getTenderLinkTablePageBySlug(slug, language)
      .then(setPage)
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [slug, language]);

  return { page, loading, error };
}

export function useTenderNormalPage(slug) {
  const language = useSelector(selectLanguage);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    tenderService
      .getTenderNormalPageBySlug(slug, language)
      .then(setPage)
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [slug, language]);

  return { page, loading, error };
}