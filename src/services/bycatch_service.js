import { gql, uploadImage as uploadImageHelper } from "./helper";

const VIDEO_LINK_FIELDS = `
  labelEn labelSi labelTa label url
`;

const RECORD_FIELDS = `
  id topicId
  nameEn nameSi nameTa name
  speciesEn speciesSi speciesTa species
  videoLinks { ${VIDEO_LINK_FIELDS} }
  imagePath imageUrl
  sortOrder
`;

const TOPIC_FIELDS = `
  id titleEn titleSi titleTa title
  slug isActive sortOrder
  records { ${RECORD_FIELDS} }
`;

export const byCatchService = {

  // ── Queries ────────────────────────────────────────────────────────────────

  async getAllByCatchTopics(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllByCatchTopics($language: String, $activeOnly: Boolean) {
        getAllBycatchTopics(language: $language, activeOnly: $activeOnly) { ${TOPIC_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllBycatchTopics;
  },

  async getByCatchTopicBySlug(slug, language = "en") {
    const data = await gql(`
      query GetByCatchTopicBySlug($slug: String!, $language: String) {
        getBycatchTopicBySlug(slug: $slug, language: $language) { ${TOPIC_FIELDS} }
      }
    `, { slug, language });
    return data.getBycatchTopicBySlug;
  },

  async getByCatchTopicById(id, language = "en") {
    const data = await gql(`
      query GetByCatchTopicById($id: Int!, $language: String) {
        getBycatchTopicById(id: $id, language: $language) { ${TOPIC_FIELDS} }
      }
    `, { id, language });
    return data.getBycatchTopicById;
  },

  // ── Topic mutations ────────────────────────────────────────────────────────

  async createByCatchTopic(data) {
    const res = await gql(`
      mutation CreateByCatchTopic($data: ByCatchTopicInput!) {
        createBycatchTopic(data: $data) { ${TOPIC_FIELDS} }
      }
    `, { data });
    return res.createBycatchTopic;
  },

  async updateByCatchTopic(id, data) {
    const res = await gql(`
      mutation UpdateByCatchTopic($id: Int!, $data: ByCatchTopicUpdateInput!) {
        updateBycatchTopic(id: $id, data: $data) { ${TOPIC_FIELDS} }
      }
    `, { id, data });
    return res.updateBycatchTopic;
  },

  async deleteByCatchTopic(id) {
    const res = await gql(`
      mutation DeleteByCatchTopic($id: Int!) {
        deleteBycatchTopic(id: $id)
      }
    `, { id });
    return res.deleteBycatchTopic;
  },

  // ── Record mutations ───────────────────────────────────────────────────────

  async createByCatchRecord(data) {
    const res = await gql(`
      mutation CreateByCatchRecord($data: ByCatchRecordInput!) {
        createBycatchRecord(data: $data) { ${RECORD_FIELDS} }
      }
    `, { data });
    return res.createBycatchRecord;
  },

  async updateByCatchRecord(id, data) {
    const res = await gql(`
      mutation UpdateByCatchRecord($id: Int!, $data: ByCatchRecordUpdateInput!) {
        updateBycatchRecord(id: $id, data: $data) { ${RECORD_FIELDS} }
      }
    `, { id, data });
    return res.updateBycatchRecord;
  },

  async deleteByCatchRecord(id) {
    const res = await gql(`
      mutation DeleteByCatchRecord($id: Int!) {
        deleteBycatchRecord(id: $id)
      }
    `, { id });
    return res.deleteBycatchRecord;
  },

  // ── File upload ────────────────────────────────────────────────────────────

  async uploadRecordImage(file) {
    const path = await uploadImageHelper(file);
    const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
    return { path, url: `${BASE}/${path}` };
  },
};
