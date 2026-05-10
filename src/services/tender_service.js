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

export const tenderService = {

  // ── Navbar ──────────────────────────────────────────────────────────────────
  async getTenderNavbar(language = "en") {
    const data = await gql(`
      query GetTenderNavbar($language: String) {
        getTenderNavbar(language: $language) { ${NAV_ITEM_FIELDS} }
      }
    `, { language });
    return data.getTenderNavbar;
  },

  // ── Link Table Pages ────────────────────────────────────────────────────────
  async getAllTenderLinkTablePages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllTenderLinkTablePages($language: String, $activeOnly: Boolean) {
        getAllTenderLinkTablePages(language: $language, activeOnly: $activeOnly) { ${TABLE_PAGE_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllTenderLinkTablePages;
  },

  async getTenderLinkTablePageBySlug(slug, language = "en") {
    const data = await gql(`
      query GetTenderLinkTablePageBySlug($slug: String!, $language: String) {
        getTenderLinkTablePageBySlug(slug: $slug, language: $language) { ${TABLE_PAGE_FIELDS} }
      }
    `, { slug, language });
    return data.getTenderLinkTablePageBySlug;
  },

  async getTenderLinkTablePageById(id, language = "en") {
    const data = await gql(`
      query GetTenderLinkTablePageById($id: Int!, $language: String) {
        getTenderLinkTablePageById(id: $id, language: $language) { ${TABLE_PAGE_FIELDS} }
      }
    `, { id, language });
    return data.getTenderLinkTablePageById;
  },

  async createTenderLinkTablePage(data) {
    const res = await gql(`
      mutation CreateTenderLinkTablePage($data: TenderLinkTablePageInput!) {
        createTenderLinkTablePage(data: $data) { ${TABLE_PAGE_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createTenderLinkTablePage;
  },

  async updateTenderLinkTablePage(id, data) {
    const res = await gql(`
      mutation UpdateTenderLinkTablePage($id: Int!, $data: TenderLinkTablePageUpdateInput!) {
        updateTenderLinkTablePage(id: $id, data: $data) { ${TABLE_PAGE_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateTenderLinkTablePage;
  },

  async deleteTenderLinkTablePage(id) {
    const res = await gql(`
      mutation DeleteTenderLinkTablePage($id: Int!) {
        deleteTenderLinkTablePage(id: $id)
      }
    `, { id });
    return res.deleteTenderLinkTablePage;
  },

  // ── Link Table Rows ─────────────────────────────────────────────────────────
  async createTenderLinkTableRow(data) {
    const res = await gql(`
      mutation CreateTenderLinkTableRow($data: TenderLinkTableRowInput!) {
        createTenderLinkTableRow(data: $data) {
          id pageId nameEn nameSi nameTa name url pdfPath pdfUrl sortOrder
        }
      }
    `, { data: toGQL(data) });
    return res.createTenderLinkTableRow;
  },

  async updateTenderLinkTableRow(id, data) {
    const res = await gql(`
      mutation UpdateTenderLinkTableRow($id: Int!, $data: TenderLinkTableRowUpdateInput!) {
        updateTenderLinkTableRow(id: $id, data: $data) {
          id pageId nameEn nameSi nameTa name url pdfPath pdfUrl sortOrder
        }
      }
    `, { id, data: toGQL(data) });
    return res.updateTenderLinkTableRow;
  },

  async deleteTenderLinkTableRow(id) {
    const res = await gql(`
      mutation DeleteTenderLinkTableRow($id: Int!) {
        deleteTenderLinkTableRow(id: $id)
      }
    `, { id });
    return res.deleteTenderLinkTableRow;
  },

  // ── Normal Pages ────────────────────────────────────────────────────────────
  async getAllTenderNormalPages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllTenderNormalPages($language: String, $activeOnly: Boolean) {
        getAllTenderNormalPages(language: $language, activeOnly: $activeOnly) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllTenderNormalPages;
  },

  async getTenderNormalPageBySlug(slug, language = "en") {
    const data = await gql(`
      query GetTenderNormalPageBySlug($slug: String!, $language: String) {
        getTenderNormalPageBySlug(slug: $slug, language: $language) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { slug, language });
    return data.getTenderNormalPageBySlug;
  },

  async getTenderNormalPageById(id, language = "en") {
    const data = await gql(`
      query GetTenderNormalPageById($id: Int!, $language: String) {
        getTenderNormalPageById(id: $id, language: $language) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { id, language });
    return data.getTenderNormalPageById;
  },

  async createTenderNormalPage(data) {
    const res = await gql(`
      mutation CreateTenderNormalPage($data: TenderNormalPageInput!) {
        createTenderNormalPage(data: $data) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createTenderNormalPage;
  },

  async updateTenderNormalPage(id, data) {
    const res = await gql(`
      mutation UpdateTenderNormalPage($id: Int!, $data: TenderNormalPageUpdateInput!) {
        updateTenderNormalPage(id: $id, data: $data) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateTenderNormalPage;
  },

  async deleteTenderNormalPage(id) {
    const res = await gql(`
      mutation DeleteTenderNormalPage($id: Int!) {
        deleteTenderNormalPage(id: $id)
      }
    `, { id });
    return res.deleteTenderNormalPage;
  },

  // ── Direct Link Pages ───────────────────────────────────────────────────────
  async getAllTenderDirectLinkPages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllTenderDirectLinkPages($language: String, $activeOnly: Boolean) {
        getAllTenderDirectLinkPages(language: $language, activeOnly: $activeOnly) { ${DIRECT_LINK_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllTenderDirectLinkPages;
  },

  async createTenderDirectLinkPage(data) {
    const res = await gql(`
      mutation CreateTenderDirectLinkPage($data: TenderDirectLinkPageInput!) {
        createTenderDirectLinkPage(data: $data) { ${DIRECT_LINK_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createTenderDirectLinkPage;
  },

  async updateTenderDirectLinkPage(id, data) {
    const res = await gql(`
      mutation UpdateTenderDirectLinkPage($id: Int!, $data: TenderDirectLinkPageUpdateInput!) {
        updateTenderDirectLinkPage(id: $id, data: $data) { ${DIRECT_LINK_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateTenderDirectLinkPage;
  },

  async deleteTenderDirectLinkPage(id) {
    const res = await gql(`
      mutation DeleteTenderDirectLinkPage($id: Int!) {
        deleteTenderDirectLinkPage(id: $id)
      }
    `, { id });
    return res.deleteTenderDirectLinkPage;
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