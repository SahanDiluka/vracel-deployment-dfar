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

export const downloadService = {

  // ── Navbar ──────────────────────────────────────────────────────────────────
  async getDownloadNavbar(language = "en") {
    const data = await gql(`
      query GetDownloadNavbar($language: String) {
        getDownloadNavbar(language: $language) { ${NAV_ITEM_FIELDS} }
      }
    `, { language });
    return data.getDownloadNavbar;
  },

  // ── Link Table Pages ────────────────────────────────────────────────────────
  async getAllDownloadLinkTablePages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllDownloadLinkTablePages($language: String, $activeOnly: Boolean) {
        getAllDownloadLinkTablePages(language: $language, activeOnly: $activeOnly) { ${TABLE_PAGE_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllDownloadLinkTablePages;
  },

  async getDownloadLinkTablePageBySlug(slug, language = "en") {
    const data = await gql(`
      query GetDownloadLinkTablePageBySlug($slug: String!, $language: String) {
        getDownloadLinkTablePageBySlug(slug: $slug, language: $language) { ${TABLE_PAGE_FIELDS} }
      }
    `, { slug, language });
    return data.getDownloadLinkTablePageBySlug;
  },

  async getDownloadLinkTablePageById(id, language = "en") {
    const data = await gql(`
      query GetDownloadLinkTablePageById($id: Int!, $language: String) {
        getDownloadLinkTablePageById(id: $id, language: $language) { ${TABLE_PAGE_FIELDS} }
      }
    `, { id, language });
    return data.getDownloadLinkTablePageById;
  },

  async createDownloadLinkTablePage(data) {
    const res = await gql(`
      mutation CreateDownloadLinkTablePage($data: DownloadLinkTablePageInput!) {
        createDownloadLinkTablePage(data: $data) { ${TABLE_PAGE_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createDownloadLinkTablePage;
  },

  async updateDownloadLinkTablePage(id, data) {
    const res = await gql(`
      mutation UpdateDownloadLinkTablePage($id: Int!, $data: DownloadLinkTablePageUpdateInput!) {
        updateDownloadLinkTablePage(id: $id, data: $data) { ${TABLE_PAGE_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateDownloadLinkTablePage;
  },

  async deleteDownloadLinkTablePage(id) {
    const res = await gql(`
      mutation DeleteDownloadLinkTablePage($id: Int!) {
        deleteDownloadLinkTablePage(id: $id)
      }
    `, { id });
    return res.deleteDownloadLinkTablePage;
  },

  // ── Link Table Rows ─────────────────────────────────────────────────────────
  async createDownloadLinkTableRow(data) {
    const res = await gql(`
      mutation CreateDownloadLinkTableRow($data: DownloadLinkTableRowInput!) {
        createDownloadLinkTableRow(data: $data) {
          id pageId nameEn nameSi nameTa name url pdfPath pdfUrl sortOrder
        }
      }
    `, { data: toGQL(data) });
    return res.createDownloadLinkTableRow;
  },

  async updateDownloadLinkTableRow(id, data) {
    const res = await gql(`
      mutation UpdateDownloadLinkTableRow($id: Int!, $data: DownloadLinkTableRowUpdateInput!) {
        updateDownloadLinkTableRow(id: $id, data: $data) {
          id pageId nameEn nameSi nameTa name url pdfPath pdfUrl sortOrder
        }
      }
    `, { id, data: toGQL(data) });
    return res.updateDownloadLinkTableRow;
  },

  async deleteDownloadLinkTableRow(id) {
    const res = await gql(`
      mutation DeleteDownloadLinkTableRow($id: Int!) {
        deleteDownloadLinkTableRow(id: $id)
      }
    `, { id });
    return res.deleteDownloadLinkTableRow;
  },

  // ── Normal Pages ────────────────────────────────────────────────────────────
  async getAllDownloadNormalPages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllDownloadNormalPages($language: String, $activeOnly: Boolean) {
        getAllDownloadNormalPages(language: $language, activeOnly: $activeOnly) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllDownloadNormalPages;
  },

  async getDownloadNormalPageBySlug(slug, language = "en") {
    const data = await gql(`
      query GetDownloadNormalPageBySlug($slug: String!, $language: String) {
        getDownloadNormalPageBySlug(slug: $slug, language: $language) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { slug, language });
    return data.getDownloadNormalPageBySlug;
  },

  async getDownloadNormalPageById(id, language = "en") {
    const data = await gql(`
      query GetDownloadNormalPageById($id: Int!, $language: String) {
        getDownloadNormalPageById(id: $id, language: $language) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { id, language });
    return data.getDownloadNormalPageById;
  },

  async createDownloadNormalPage(data) {
    const res = await gql(`
      mutation CreateDownloadNormalPage($data: DownloadNormalPageInput!) {
        createDownloadNormalPage(data: $data) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createDownloadNormalPage;
  },

  async updateDownloadNormalPage(id, data) {
    const res = await gql(`
      mutation UpdateDownloadNormalPage($id: Int!, $data: DownloadNormalPageUpdateInput!) {
        updateDownloadNormalPage(id: $id, data: $data) { ${NORMAL_PAGE_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateDownloadNormalPage;
  },

  async deleteDownloadNormalPage(id) {
    const res = await gql(`
      mutation DeleteDownloadNormalPage($id: Int!) {
        deleteDownloadNormalPage(id: $id)
      }
    `, { id });
    return res.deleteDownloadNormalPage;
  },

  // ── Direct Link Pages ───────────────────────────────────────────────────────
  async getAllDownloadDirectLinkPages(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllDownloadDirectLinkPages($language: String, $activeOnly: Boolean) {
        getAllDownloadDirectLinkPages(language: $language, activeOnly: $activeOnly) { ${DIRECT_LINK_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllDownloadDirectLinkPages;
  },

  async createDownloadDirectLinkPage(data) {
    const res = await gql(`
      mutation CreateDownloadDirectLinkPage($data: DownloadDirectLinkPageInput!) {
        createDownloadDirectLinkPage(data: $data) { ${DIRECT_LINK_FIELDS} }
      }
    `, { data: toGQL(data) });
    return res.createDownloadDirectLinkPage;
  },

  async updateDownloadDirectLinkPage(id, data) {
    const res = await gql(`
      mutation UpdateDownloadDirectLinkPage($id: Int!, $data: DownloadDirectLinkPageUpdateInput!) {
        updateDownloadDirectLinkPage(id: $id, data: $data) { ${DIRECT_LINK_FIELDS} }
      }
    `, { id, data: toGQL(data) });
    return res.updateDownloadDirectLinkPage;
  },

  async deleteDownloadDirectLinkPage(id) {
    const res = await gql(`
      mutation DeleteDownloadDirectLinkPage($id: Int!) {
        deleteDownloadDirectLinkPage(id: $id)
      }
    `, { id });
    return res.deleteDownloadDirectLinkPage;
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


