import { gql, uploadImage } from "./helper";

export const quickAccessService = {

  getAll: async (language = null) => {
    const data = await gql(`
      query GetAllQuickAccess($language: String) {
        getAllQuickAccess(language: $language) {
          id name link language
          icon iconUrl
        }
      }
    `, { language });
    return data.getAllQuickAccess;
  },

  getById: async (id) => {
    const data = await gql(`
      query GetQuickAccess($id: Int!) {
        getQuickAccessById(id: $id) {
          id name link language
          icon iconUrl
        }
      }
    `, { id });
    return data.getQuickAccessById;
  },

  create: async ({ name, link, icon, language = "en" }) => {
    const iconPath = icon instanceof File
      ? await uploadImage(icon)
      : icon ?? null;

    const data = await gql(`
      mutation CreateQuickAccess($data: HomeQuickAccessInput!) {
        createQuickAccess(data: $data) {
          id name link language
          icon iconUrl
        }
      }
    `, {
      data: { name, link, icon: iconPath, language },
    });
    return data.createQuickAccess;
  },

  update: async (id, { name, link, icon, language }) => {
    const iconPath = icon instanceof File
      ? await uploadImage(icon)
      : icon ?? null;

    const data = await gql(`
      mutation UpdateQuickAccess($id: Int!, $data: HomeQuickAccessUpdateInput!) {
        updateQuickAccess(id: $id, data: $data) {
          id name link language
          icon iconUrl
        }
      }
    `, {
      id,
      data: {
        name:     name     ?? null,
        link:     link     ?? null,
        icon:     iconPath,
        language: language ?? null,
      },
    });
    return data.updateQuickAccess;
  },

  delete: async (id) => {
    const data = await gql(`
      mutation DeleteQuickAccess($id: Int!) {
        deleteQuickAccess(id: $id)
      }
    `, { id });
    return data.deleteQuickAccess;
  },

};