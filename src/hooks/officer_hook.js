import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import { officerService } from "../services/officer_service";

export function useOfficerNavbar() {
  const language = useSelector(selectLanguage);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    officerService
      .getOfficerNavbar(language)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [language]);

  return { items, loading };
}

export function useOfficerLinkTablePage(slug) {
  const language = useSelector(selectLanguage);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    officerService
      .getOfficerLinkTablePageBySlug(slug, language)
      .then(setPage)
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [slug, language]);

  return { page, loading, error };
}

export function useOfficerNormalPage(slug) {
  const language = useSelector(selectLanguage);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    officerService
      .getOfficerNormalPageBySlug(slug, language)
      .then(setPage)
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [slug, language]);

  return { page, loading, error };
}
