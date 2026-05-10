// src/hooks/useCmsPage.js
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../languageSlice";
import { cmsService } from "../services/information_service";

/**
 * Hook to fetch a Link Table Page by slug.
 * Re-fetches automatically when language changes.
 */
export function useLinkTablePage(slug) {
  const language = useSelector(selectLanguage);
  const [page, setPage]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    cmsService
      .getLinkTablePageBySlug(slug, language)
      .then(setPage)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug, language]);

  return { page, loading, error };
}

/**
 * Hook to fetch a Normal Page by slug.
 * Re-fetches automatically when language changes.
 */
export function useNormalPage(slug) {
  const language = useSelector(selectLanguage);
  const [page, setPage]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    cmsService
      .getNormalPageBySlug(slug, language)
      .then(setPage)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug, language]);

  return { page, loading, error };
}

/**
 * Hook to fetch navbar items.
 * Re-fetches automatically when language changes.
 */
export function useNavbar() {
  const language = useSelector(selectLanguage);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    cmsService
      .getNavbar(language)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [language]);

  return { items, loading };
}