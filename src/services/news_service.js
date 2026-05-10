import { gql, uploadImage } from "./helper";

export const newsService = {

  getAll: async () => {
    const data = await gql(`
      query {
        getAllNews {
          id topic description
          picture pictureUrl language
        }
      }
    `);
    return data.getAllNews;
  },
  getbyLanhguage: async (language) => {
    const data = await gql(`
      query GetNewsByLanguage($language: String!) {
        getNewsByLanguage(language: $language) {
          id topic description
          picture pictureUrl
        }
      }
    `, { language });
    return data.getNewsByLanguage;
  },
  getById: async (id) => {
    const data = await gql(`
      query GetNews($id: Int!) {
        getNewsById(id: $id) {
          id topic description
          picture pictureUrl
        }
      }
    `, { id });
    return data.getNewsById;
  },

  getByTopic: async (topic) => {
    const data = await gql(`
      query GetNewsByTopic($topic: String!) {
        getNewsByTopic(topic: $topic) {
          id topic description
          picture pictureUrl
        }
      }
    `, { topic });
    return data.getNewsByTopic;
  },

   create: async ({ topic, description, picture, language = "en" }) => {
    const picturePath = picture instanceof File
      ? await uploadImage(picture)
      : picture ?? null;
 
    const data = await gql(`
      mutation CreateNews($data: NewsInput!) {
        createNews(data: $data) {
          id topic description language
          picture pictureUrl
        }
      }
    `, {
      data: { topic, description: description ?? null, picture: picturePath, language },
    });
    return data.createNews;
  },
 
  update: async (id, { topic, description, picture, language }) => {
    const picturePath = picture instanceof File
      ? await uploadImage(picture)
      : picture ?? null;
 
    const data = await gql(`
      mutation UpdateNews($id: Int!, $data: NewsUpdateInput!) {
        updateNews(id: $id, data: $data) {
          id topic description language
          picture pictureUrl
        }
      }
    `, {
      id,
      data: {
        topic:       topic       ?? null,
        description: description ?? null,
        picture:     picturePath,
        language:    language    ?? null,
      },
    });
    return data.updateNews;
  },
 
  delete: async (id) => {
    const data = await gql(`
      mutation DeleteNews($id: Int!) {
        deleteNews(id: $id)
      }
    `, { id });
    return data.deleteNews;
  }
}