import { gql, uploadImage } from "./helper";

export const divisionService = {

  getAll: async (language = null) => {
    const data = await gql(`
      query GetAllDivisions($language: String) {
        getAllDivisions(language: $language) {
          id topic title description link intro details language
          picture pictureUrl
          image1 image1Url
        }
      }
    `, { language });
    return data.getAllDivisions;
  },

  getById: async (id) => {
    const data = await gql(`
      query GetDivision($id: Int!) {
        getDivisionById(id: $id) {
          id topic title description link intro details language
          picture pictureUrl
          image1 image1Url
        }
      }
    `, { id });
    return data.getDivisionById;
  },

  getByTopic: async (topic, language = null) => {
    const data = await gql(`
      query GetByTopic($topic: String!, $language: String) {
        getDivisionsByTopic(topic: $topic, language: $language) {
          id topic title description link intro details language
          picture pictureUrl
          image1 image1Url
        }
      }
    `, { topic, language });
    return data.getDivisionsByTopic;
  },

  create: async (fields) => {
    const picture = fields.picture instanceof File
      ? await uploadImage(fields.picture)
      : fields.picture ?? null;

    const image1 = fields.image1 instanceof File
      ? await uploadImage(fields.image1)
      : fields.image1 ?? null;

    const data = await gql(`
      mutation CreateDivision($data: DivisionInput!) {
        createDivision(data: $data) {
          id topic title description link intro details language
          picture pictureUrl
          image1 image1Url
        }
      }
    `, {
      data: {
        topic:       fields.topic       ?? "",
        title:       fields.title       ?? "",
        description: fields.description ?? null,
        link:        fields.link        ?? null,
        intro:       fields.intro       ?? null,
        details:     fields.details     ?? null,
        language:    fields.language    ?? "en",
        picture,
        image1,
      },
    });
    return data.createDivision;
  },

  update: async (id, fields) => {
    const picture = fields.picture instanceof File
      ? await uploadImage(fields.picture)
      : fields.picture ?? null;

    const image1 = fields.image1 instanceof File
      ? await uploadImage(fields.image1)
      : fields.image1 ?? null;

    const data = await gql(`
      mutation UpdateDivision($id: Int!, $data: DivisionUpdateInput!) {
        updateDivision(id: $id, data: $data) {
          id topic title description link intro details language
          picture pictureUrl
          image1 image1Url
        }
      }
    `, {
      id,
      data: {
        topic:       fields.topic       ?? null,
        title:       fields.title       ?? null,
        description: fields.description ?? null,
        link:        fields.link        ?? null,
        intro:       fields.intro       ?? null,
        details:     fields.details     ?? null,
        language:    fields.language    ?? null,
        picture,
        image1,
      },
    });
    return data.updateDivision;
  },

  delete: async (id) => {
    const data = await gql(`
      mutation DeleteDivision($id: Int!) {
        deleteDivision(id: $id)
      }
    `, { id });
    return data.deleteDivision;
  },

};