import { gql, uploadImage as uploadImageHelper } from "./helper";

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

export const officerService = {

  // ── Navbar ──────────────────────────────────────────────────────────────────
  async getOfficerNavbar(language = "en") {
    const data = await gql(`
      query GetOfficerNavbar($language: String) {
        getOfficerNavbar(language: $language) { ${NAV_ITEM_FIELDS} }
      }
    `, { language });
    return data.getOfficerNavbar;
  },

  // ── Link Table Pages ────────────────────────────────────────────────────────
  async getAllOfficerLinkTablePages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllOfficerLinkTablePages($language: String, $activeOnly: Boolean) {
        getAllOfficerLinkTablePages(language: $language, activeOnly: $activeOnly) { ${TABLE_PAGE_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllOfficerLinkTablePages;
  },

  async getOfficerLinkTablePageBySlug(slug, language = "en") {
    const data = await gql(`
      query GetOfficerLinkTablePageBySlug($slug: String!, $language: String) {
        getOfficerLinkTablePageBySlug(slug: $slug, language: $language) { ${TABLE_PAGE_FIELDS} }
      }
    `, { slug, language });
    return data.getOfficerLinkTablePageBySlug;
  },

  async getOfficerLinkTablePageById(id, language = "en") {
    const data = await gql(`
      query GetOfficerLinkTablePageById($id: Int!, $language: String) {
        getOfficerLinkTablePageById(id: $id, language: $language) { ${TABLE_PAGE_FIELDS} }
      }
    `, { id, language });
    return data.getOfficerLinkTablePageById;
  },

  async createOfficerLinkTablePage(data) {
    const res = await gql(`
      mutation CreateOfficerLinkTablePage($data: OfficerLinkTablePageInput!) {
        createOfficerLinkTablePage(data: $data) { ${TABLE_PAGE_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createOfficerLinkTablePage;
  },

  async updateOfficerLinkTablePage(id, data) {
    const res = await gql(`
      mutation UpdateOfficerLinkTablePage($id: Int!, $data: OfficerLinkTablePageUpdateInput!) {
        updateOfficerLinkTablePage(id: $id, data: $data) { ${TABLE_PAGE_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateOfficerLinkTablePage;
  },

  async deleteOfficerLinkTablePage(id) {
    const res = await gql(`
      mutation DeleteOfficerLinkTablePage($id: Int!) {
        deleteOfficerLinkTablePage(id: $id)
      }
    `, { id });
    return res.deleteOfficerLinkTablePage;
  },

  // ── Link Table Rows ─────────────────────────────────────────────────────────
  async createOfficerLinkTableRow(data) {
    const res = await gql(`
      mutation CreateOfficerLinkTableRow($data: OfficerLinkTableRowInput!) {
        createOfficerLinkTableRow(data: $data) {
          id pageId nameEn nameSi nameTa name url pdfPath pdfUrl sortOrder
        }
      }
    `, { data: toGQL(data) });
    return res.createOfficerLinkTableRow;
  },

  async updateOfficerLinkTableRow(id, data) {
    const res = await gql(`
      mutation UpdateOfficerLinkTableRow($id: Int!, $data: OfficerLinkTableRowUpdateInput!) {
        updateOfficerLinkTableRow(id: $id, data: $data) {
          id pageId nameEn nameSi nameTa name url pdfPath pdfUrl sortOrder
        }
      }
    `, { id, data: toGQL(data) });
    return res.updateOfficerLinkTableRow;
  },

  async deleteOfficerLinkTableRow(id) {
    const res = await gql(`
      mutation DeleteOfficerLinkTableRow($id: Int!) {
        deleteOfficerLinkTableRow(id: $id)
      }
    `, { id });
    return res.deleteOfficerLinkTableRow;
  },

  // ── Normal Pages ────────────────────────────────────────────────────────────
  async getAllOfficerNormalPages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllOfficerNormalPages($language: String, $activeOnly: Boolean) {
        getAllOfficerNormalPages(language: $language, activeOnly: $activeOnly) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllOfficerNormalPages;
  },

  async getOfficerNormalPageBySlug(slug, language = "en") {
    const data = await gql(`
      query GetOfficerNormalPageBySlug($slug: String!, $language: String) {
        getOfficerNormalPageBySlug(slug: $slug, language: $language) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { slug, language });
    return data.getOfficerNormalPageBySlug;
  },

  async getOfficerNormalPageById(id, language = "en") {
    const data = await gql(`
      query GetOfficerNormalPageById($id: Int!, $language: String) {
        getOfficerNormalPageById(id: $id, language: $language) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { id, language });
    return data.getOfficerNormalPageById;
  },

  async createOfficerNormalPage(data) {
    const res = await gql(`
      mutation CreateOfficerNormalPage($data: OfficerNormalPageInput!) {
        createOfficerNormalPage(data: $data) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createOfficerNormalPage;
  },

  async updateOfficerNormalPage(id, data) {
    const res = await gql(`
      mutation UpdateOfficerNormalPage($id: Int!, $data: OfficerNormalPageUpdateInput!) {
        updateOfficerNormalPage(id: $id, data: $data) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateOfficerNormalPage;
  },

  async deleteOfficerNormalPage(id) {
    const res = await gql(`
      mutation DeleteOfficerNormalPage($id: Int!) {
        deleteOfficerNormalPage(id: $id)
      }
    `, { id });
    return res.deleteOfficerNormalPage;
  },

  // ── Direct Link Pages ───────────────────────────────────────────────────────
  async getAllOfficerDirectLinkPages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllOfficerDirectLinkPages($language: String, $activeOnly: Boolean) {
        getAllOfficerDirectLinkPages(language: $language, activeOnly: $activeOnly) { ${DIRECT_LINK_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllOfficerDirectLinkPages;
  },

  async createOfficerDirectLinkPage(data) {
    const res = await gql(`
      mutation CreateOfficerDirectLinkPage($data: OfficerDirectLinkPageInput!) {
        createOfficerDirectLinkPage(data: $data) { ${DIRECT_LINK_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createOfficerDirectLinkPage;
  },

  async updateOfficerDirectLinkPage(id, data) {
    const res = await gql(`
      mutation UpdateOfficerDirectLinkPage($id: Int!, $data: OfficerDirectLinkPageUpdateInput!) {
        updateOfficerDirectLinkPage(id: $id, data: $data) { ${DIRECT_LINK_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateOfficerDirectLinkPage;
  },

  async deleteOfficerDirectLinkPage(id) {
    const res = await gql(`
      mutation DeleteOfficerDirectLinkPage($id: Int!) {
        deleteOfficerDirectLinkPage(id: $id)
      }
    `, { id });
    return res.deleteOfficerDirectLinkPage;
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
