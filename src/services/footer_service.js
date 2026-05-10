// src/services/footer_service.js
import { gql } from "./helper"; // ← use the shared helper

const RELATED_FIELDS = `id nameEn nameSi nameTa name url isActive sortOrder`;
const SOCIAL_FIELDS  = `id platform url isActive sortOrder`;

export const footerService = {

  // ── Related Links ──────────────────────────────────────────────────────────

  async getRelatedLinks(language = "en", activeOnly = true) {
    const data = await gql(`
      query GetRelated($language: String, $activeOnly: Boolean) {
        getFooterRelatedLinks(language: $language, activeOnly: $activeOnly) { ${RELATED_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getFooterRelatedLinks;
  },

  async createRelatedLink(input) {
    const data = await gql(`
      mutation CreateRelated($data: FooterRelatedLinkInput!) {
        createFooterRelatedLink(data: $data) { ${RELATED_FIELDS} }
      }
    `, { data: toRelatedInput(input) });
    return data.createFooterRelatedLink;
  },

  async updateRelatedLink(id, input) {
    const data = await gql(`
      mutation UpdateRelated($id: Int!, $data: FooterRelatedLinkUpdateInput!) {
        updateFooterRelatedLink(id: $id, data: $data) { ${RELATED_FIELDS} }
      }
    `, { id, data: toRelatedInput(input) });
    return data.updateFooterRelatedLink;
  },

  async deleteRelatedLink(id) {
    const data = await gql(`
      mutation DeleteRelated($id: Int!) { deleteFooterRelatedLink(id: $id) }
    `, { id });
    return data.deleteFooterRelatedLink;
  },

  // ── Social Links ───────────────────────────────────────────────────────────

  async getSocialLinks(activeOnly = true) {
    const data = await gql(`
      query GetSocial($activeOnly: Boolean) {
        getFooterSocialLinks(activeOnly: $activeOnly) { ${SOCIAL_FIELDS} }
      }
    `, { activeOnly });
    return data.getFooterSocialLinks;
  },

  async createSocialLink(input) {
    const data = await gql(`
      mutation CreateSocial($data: FooterSocialLinkInput!) {
        createFooterSocialLink(data: $data) { ${SOCIAL_FIELDS} }
      }
    `, { data: toSocialInput(input) });
    return data.createFooterSocialLink;
  },

  async updateSocialLink(id, input) {
    const data = await gql(`
      mutation UpdateSocial($id: Int!, $data: FooterSocialLinkUpdateInput!) {
        updateFooterSocialLink(id: $id, data: $data) { ${SOCIAL_FIELDS} }
      }
    `, { id, data: toSocialInput(input) });
    return data.updateFooterSocialLink;
  },

  async deleteSocialLink(id) {
    const data = await gql(`
      mutation DeleteSocial($id: Int!) { deleteFooterSocialLink(id: $id) }
    `, { id });
    return data.deleteFooterSocialLink;
  },
};

// ── Input normalizers (snake_case → camelCase) ─────────────────────────────

function toSocialInput({ platform, url, is_active, isActive, sort_order, sortOrder }) {
  return {
    platform,
    url,
    isActive:  isActive  ?? is_active,
    sortOrder: sortOrder ?? sort_order,
  };
}

function toRelatedInput({ nameEn, name_en, nameSi, name_si, nameTa, name_ta,
                          name, url, is_active, isActive, sort_order, sortOrder }) {
  return {
    nameEn:    nameEn    ?? name_en,
    nameSi:    nameSi    ?? name_si,
    nameTa:    nameTa    ?? name_ta,
    name,
    url,
    isActive:  isActive  ?? is_active,
    sortOrder: sortOrder ?? sort_order,
  };
}