import { gql, uploadImage as uploadImageHelper } from "./helper";

// Convert snake_case form keys → camelCase for GraphQL input types
const toGQL = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      v,
    ])
  );

// ── fragments ─────────────────────────────────────────────────────────────────

const NAV_ITEM_FIELDS = `id pageType label path url sortOrder`;

const TABLE_PAGE_FIELDS = `
  id navLabelEn navLabelSi navLabelTa navLabel
  headerEn headerSi headerTa header
  slug isActive sortOrder
  rows {
    id pageId nameEn nameSi nameTa name
    url pdfPath pdfUrl sortOrder
  }
`;

const NORMAL_PAGE_FIELDS = `
  id navLabelEn navLabelSi navLabelTa navLabel
  headerEn headerSi headerTa header
  descriptionEn descriptionSi descriptionTa description
  secondHeaderEn secondHeaderSi secondHeaderTa secondHeader
  imagePath imageUrl
  buttonLabelEn buttonLabelSi buttonLabelTa buttonLabel
  buttonUrl slug isActive sortOrder
`;

const DIRECT_LINK_FIELDS = `
  id navLabelEn navLabelSi navLabelTa navLabel
  url isActive sortOrder
`;

export const cmsService = {

  // ── Navbar ──────────────────────────────────────────────────────────────────
  async getNavbar(language = "en") {
    const data = await gql(`
      query GetNavbar($language: String) {
        getNavbar(language: $language) { ${NAV_ITEM_FIELDS} }
      }
    `, { language });
    return data.getNavbar;
  },

  // ── Link Table Pages ────────────────────────────────────────────────────────
  async getAllLinkTablePages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllLinkTablePages($language: String, $activeOnly: Boolean) {
        getAllLinkTablePages(language: $language, activeOnly: $activeOnly) { ${TABLE_PAGE_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllLinkTablePages;
  },

  async getLinkTablePageBySlug(slug, language = "en") {
    const data = await gql(`
      query GetLinkTablePageBySlug($slug: String!, $language: String) {
        getLinkTablePageBySlug(slug: $slug, language: $language) { ${TABLE_PAGE_FIELDS} }
      }
    `, { slug, language });
    return data.getLinkTablePageBySlug;
  },

  async getLinkTablePageById(id, language = "en") {
    const data = await gql(`
      query GetLinkTablePageById($id: Int!, $language: String) {
        getLinkTablePageById(id: $id, language: $language) { ${TABLE_PAGE_FIELDS} }
      }
    `, { id, language });
    return data.getLinkTablePageById;
  },

  async createLinkTablePage(data) {
    const res = await gql(`
      mutation CreateLinkTablePage($data: LinkTablePageInput!) {
        createLinkTablePage(data: $data) { ${TABLE_PAGE_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createLinkTablePage;
  },

  async updateLinkTablePage(id, data) {
    const res = await gql(`
      mutation UpdateLinkTablePage($id: Int!, $data: LinkTablePageUpdateInput!) {
        updateLinkTablePage(id: $id, data: $data) { ${TABLE_PAGE_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateLinkTablePage;
  },

  async deleteLinkTablePage(id) {
    const res = await gql(`
      mutation DeleteLinkTablePage($id: Int!) {
        deleteLinkTablePage(id: $id)
      }
    `, { id });
    return res.deleteLinkTablePage;
  },

  // ── Link Table Rows ─────────────────────────────────────────────────────────
  async createLinkTableRow(data) {
    const res = await gql(`
      mutation CreateLinkTableRow($data: LinkTableRowInput!) {
        createLinkTableRow(data: $data) {
          id pageId nameEn nameSi nameTa name url pdfPath pdfUrl sortOrder
        }
      }
    `, { data: toGQL(data) });
    return res.createLinkTableRow;
  },

  async updateLinkTableRow(id, data) {
    const res = await gql(`
      mutation UpdateLinkTableRow($id: Int!, $data: LinkTableRowUpdateInput!) {
        updateLinkTableRow(id: $id, data: $data) {
          id pageId nameEn nameSi nameTa name url pdfPath pdfUrl sortOrder
        }
      }
    `, { id, data: toGQL(data) });
    return res.updateLinkTableRow;
  },

  async deleteLinkTableRow(id) {
    const res = await gql(`
      mutation DeleteLinkTableRow($id: Int!) {
        deleteLinkTableRow(id: $id)
      }
    `, { id });
    return res.deleteLinkTableRow;
  },

  // ── Normal Pages ────────────────────────────────────────────────────────────
  async getAllNormalPages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllNormalPages($language: String, $activeOnly: Boolean) {
        getAllNormalPages(language: $language, activeOnly: $activeOnly) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllNormalPages;
  },

  async getNormalPageBySlug(slug, language = "en") {
    const data = await gql(`
      query GetNormalPageBySlug($slug: String!, $language: String) {
        getNormalPageBySlug(slug: $slug, language: $language) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { slug, language });
    return data.getNormalPageBySlug;
  },

  async getNormalPageById(id, language = "en") {
    const data = await gql(`
      query GetNormalPageById($id: Int!, $language: String) {
        getNormalPageById(id: $id, language: $language) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { id, language });
    return data.getNormalPageById;
  },

  async createNormalPage(data) {
    const res = await gql(`
      mutation CreateNormalPage($data: NormalPageInput!) {
        createNormalPage(data: $data) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createNormalPage;
  },

  async updateNormalPage(id, data) {
    const res = await gql(`
      mutation UpdateNormalPage($id: Int!, $data: NormalPageUpdateInput!) {
        updateNormalPage(id: $id, data: $data) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateNormalPage;
  },

  async deleteNormalPage(id) {
    const res = await gql(`
      mutation DeleteNormalPage($id: Int!) {
        deleteNormalPage(id: $id)
      }
    `, { id });
    return res.deleteNormalPage;
  },

  // ── Direct Link Pages ───────────────────────────────────────────────────────
  async getAllDirectLinkPages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllDirectLinkPages($language: String, $activeOnly: Boolean) {
        getAllDirectLinkPages(language: $language, activeOnly: $activeOnly) { ${DIRECT_LINK_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllDirectLinkPages;
  },

  async createDirectLinkPage(data) {
    const res = await gql(`
      mutation CreateDirectLinkPage($data: DirectLinkPageInput!) {
        createDirectLinkPage(data: $data) { ${DIRECT_LINK_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createDirectLinkPage;
  },

  async updateDirectLinkPage(id, data) {
    const res = await gql(`
      mutation UpdateDirectLinkPage($id: Int!, $data: DirectLinkPageUpdateInput!) {
        updateDirectLinkPage(id: $id, data: $data) { ${DIRECT_LINK_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateDirectLinkPage;
  },

  async deleteDirectLinkPage(id) {
    const res = await gql(`
      mutation DeleteDirectLinkPage($id: Int!) {
        deleteDirectLinkPage(id: $id)
      }
    `, { id });
    return res.deleteDirectLinkPage;
  },

  // ── File uploads ────────────────────────────────────────────────────────────
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

  async uploadImage(file) {
    const path = await uploadImageHelper(file);
    const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
    return { path, url: `${BASE}/${path}` };
  },
};