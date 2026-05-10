// src/services/about_service.js
// 1. Import the centralized tools from your helper
import { gql, uploadImage } from "./helper";

const DG_FIELDS = `
  id nameEn nameSi nameTa name
  titleEn titleSi titleTa title
  departmentEn departmentSi departmentTa department
  quoteEn quoteSi quoteTa quote
  messageEn messageSi messageTa message
  imagePath imageUrl initials isActive
`;

const OFFICIAL_FIELDS = `
  id roleEn roleSi roleTa role
  nameEn nameSi nameTa name
  ministryEn ministrySi ministryTa ministry
  phone fax imagePath imageUrl isActive sortOrder
`;

export const aboutService = {

  // ── Director General ──────────────────────────────────────────────────────

  async getDirectorGeneral(language = "en") {
    const data = await gql(`
      query GetDG($language: String) {
        getDirectorGeneral(language: $language) { ${DG_FIELDS} }
      }
    `, { language });
    return data.getDirectorGeneral;
  },

  async getAllDirectorGenerals(language = "en") {
    const data = await gql(`
      query GetAllDGs($language: String) {
        getAllDirectorGenerals(language: $language) { ${DG_FIELDS} }
      }
    `, { language });
    return data.getAllDirectorGenerals;
  },

  async createDirectorGeneral(input) {
    let processedInput = { ...input };
    // If the user provided a File object, upload it first
    if (input.imagePath instanceof File) {
      processedInput.imagePath = await uploadImage(input.imagePath);
    }

    const data = await gql(`
      mutation CreateDG($data: DirectorGeneralInput!) {
        createDirectorGeneral(data: $data) { ${DG_FIELDS} }
      }
    `, { data: processedInput });
    return data.createDirectorGeneral;
  },

  async updateDirectorGeneral(id, input) {
    let processedInput = { ...input };
    if (input.imagePath instanceof File) {
      processedInput.imagePath = await uploadImage(input.imagePath);
    }

    const data = await gql(`
      mutation UpdateDG($id: Int!, $data: DirectorGeneralUpdateInput!) {
        updateDirectorGeneral(id: $id, data: $data) { ${DG_FIELDS} }
      }
    `, { id, data: processedInput });
    return data.updateDirectorGeneral;
  },

  async deleteDirectorGeneral(id) {
    const data = await gql(`
      mutation DeleteDG($id: Int!) { deleteDirectorGeneral(id: $id) }
    `, { id });
    return data.deleteDirectorGeneral;
  },

  // ── Ministry Officials ────────────────────────────────────────────────────

  async getAllMinistryOfficials(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetOfficials($language: String, $activeOnly: Boolean) {
        getAllMinistryOfficials(language: $language, activeOnly: $activeOnly) { ${OFFICIAL_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllMinistryOfficials;
  },

  async createMinistryOfficial(input) {
    let processedInput = { ...input };
    // FIX: Handle file upload using the helper
    if (input.imagePath instanceof File) {
      processedInput.imagePath = await uploadImage(input.imagePath);
    }

    const data = await gql(`
      mutation CreateOfficial($data: MinistryOfficialInput!) {
        createMinistryOfficial(data: $data) { ${OFFICIAL_FIELDS} }
      }
    `, { data: processedInput });
    return data.createMinistryOfficial;
  },

  async updateMinistryOfficial(id, input) {
    let processedInput = { ...input };
    if (input.imagePath instanceof File) {
      processedInput.imagePath = await uploadImage(input.imagePath);
    }

    const data = await gql(`
      mutation UpdateOfficial($id: Int!, $data: MinistryOfficialUpdateInput!) {
        updateMinistryOfficial(id: $id, data: $data) { ${OFFICIAL_FIELDS} }
      }
    `, { id, data: processedInput });
    return data.updateMinistryOfficial;
  },

  async deleteMinistryOfficial(id) {
    const data = await gql(`
      mutation DeleteOfficial($id: Int!) { deleteMinistryOfficial(id: $id) }
    `, { id });
    // FIX: The key must match the mutation name "deleteMinistryOfficial"
    return data.deleteMinistryOfficial; 
  },
};