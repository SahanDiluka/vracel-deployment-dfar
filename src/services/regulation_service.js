// src/services/regulation_service.js
import { gql } from "./helper";

const toGQL = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      v,
    ])
  );

// ── fragments ─────────────────────────────────────────────────────────────────

const ROW_FIELDS = `
  id topicId nameEn nameSi nameTa name
  number date pdfPath pdfUrl sortOrder
`;

const TOPIC_FIELDS = `
  id navLabelEn navLabelSi navLabelTa navLabel
  headerEn headerSi headerTa header
  slug isActive sortOrder
  rows { ${ROW_FIELDS} }
`;

// ── service ───────────────────────────────────────────────────────────────────

export const regulationService = {

  // ── Topics ──────────────────────────────────────────────────────────────────

  async getAllRegulationTopics(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllRegulationTopics($language: String, $activeOnly: Boolean) {
        getAllRegulationTopics(language: $language, activeOnly: $activeOnly) {
          ${TOPIC_FIELDS}
        }
      }
    `, { language, activeOnly });
    return data.getAllRegulationTopics;
  },

  async getRegulationTopicBySlug(slug, language = "en") {
    const data = await gql(`
      query GetRegulationTopicBySlug($slug: String!, $language: String) {
        getRegulationTopicBySlug(slug: $slug, language: $language) {
          ${TOPIC_FIELDS}
        }
      }
    `, { slug, language });
    return data.getRegulationTopicBySlug;
  },

  async getRegulationTopicById(id, language = "en") {
    const data = await gql(`
      query GetRegulationTopicById($id: Int!, $language: String) {
        getRegulationTopicById(id: $id, language: $language) {
          ${TOPIC_FIELDS}
        }
      }
    `, { id, language });
    return data.getRegulationTopicById;
  },

  async createRegulationTopic(data) {
    const res = await gql(`
      mutation CreateRegulationTopic($data: RegulationTopicInput!) {
        createRegulationTopic(data: $data) { ${TOPIC_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createRegulationTopic;
  },

  async updateRegulationTopic(id, data) {
    const res = await gql(`
      mutation UpdateRegulationTopic($id: Int!, $data: RegulationTopicUpdateInput!) {
        updateRegulationTopic(id: $id, data: $data) { ${TOPIC_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateRegulationTopic;
  },

  async deleteRegulationTopic(id) {
    const res = await gql(`
      mutation DeleteRegulationTopic($id: Int!) {
        deleteRegulationTopic(id: $id)
      }
    `, { id });
    return res.deleteRegulationTopic;
  },

  // ── Rows ────────────────────────────────────────────────────────────────────

  async createRegulationRow(data) {
    const res = await gql(`
      mutation CreateRegulationRow($data: RegulationRowInput!) {
        createRegulationRow(data: $data) { ${ROW_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createRegulationRow;
  },

  async updateRegulationRow(id, data) {
    const res = await gql(`
      mutation UpdateRegulationRow($id: Int!, $data: RegulationRowUpdateInput!) {
        updateRegulationRow(id: $id, data: $data) { ${ROW_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateRegulationRow;
  },

  async deleteRegulationRow(id) {
    const res = await gql(`
      mutation DeleteRegulationRow($id: Int!) {
        deleteRegulationRow(id: $id)
      }
    `, { id });
    return res.deleteRegulationRow;
  },

  // ── PDF upload ──────────────────────────────────────────────────────────────

  async uploadPdf(file) {
    const { getToken } = await import("./helper");
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const res = await fetch(`${BASE}/upload-pdf`, {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: form,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.detail || "PDF upload failed.");
    return { path: json.path, url: json.url };
  },
};
