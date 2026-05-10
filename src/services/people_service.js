import { gql, uploadImage as uploadImageHelper } from "./helper";

const MEMBER_FIELDS = `
  id topicId
  nameEn nameSi nameTa name
  positionEn positionSi positionTa position
  imagePath imageUrl
  descriptionEn descriptionSi descriptionTa description
  email phone
  sortOrder
`;

const TOPIC_FIELDS = `
  id titleEn titleSi titleTa title
  slug isActive sortOrder
  members { ${MEMBER_FIELDS} }
`;

export const peopleService = {

  // ── Queries ────────────────────────────────────────────────────────────────

  async getAllPeopleTopics(language = "en", activeOnly = null) {
    const data = await gql(`
      query GetAllPeopleTopics($language: String, $activeOnly: Boolean) {
        getAllPeopleTopics(language: $language, activeOnly: $activeOnly) { ${TOPIC_FIELDS} }
      }
    `, { language, activeOnly });
    return data.getAllPeopleTopics;
  },

  async getPeopleTopicBySlug(slug, language = "en") {
    const data = await gql(`
      query GetPeopleTopicBySlug($slug: String!, $language: String) {
        getPeopleTopicBySlug(slug: $slug, language: $language) { ${TOPIC_FIELDS} }
      }
    `, { slug, language });
    return data.getPeopleTopicBySlug;
  },

  async getPeopleTopicById(id, language = "en") {
    const data = await gql(`
      query GetPeopleTopicById($id: Int!, $language: String) {
        getPeopleTopicById(id: $id, language: $language) { ${TOPIC_FIELDS} }
      }
    `, { id, language });
    return data.getPeopleTopicById;
  },

  // ── Topic mutations ────────────────────────────────────────────────────────

  async createPeopleTopic(data) {
    const res = await gql(`
      mutation CreatePeopleTopic($data: PeopleTopicInput!) {
        createPeopleTopic(data: $data) { ${TOPIC_FIELDS} }
      }
    `, { data });
    return res.createPeopleTopic;
  },

  async updatePeopleTopic(id, data) {
    const res = await gql(`
      mutation UpdatePeopleTopic($id: Int!, $data: PeopleTopicUpdateInput!) {
        updatePeopleTopic(id: $id, data: $data) { ${TOPIC_FIELDS} }
      }
    `, { id, data });
    return res.updatePeopleTopic;
  },

  async deletePeopleTopic(id) {
    const res = await gql(`
      mutation DeletePeopleTopic($id: Int!) {
        deletePeopleTopic(id: $id)
      }
    `, { id });
    return res.deletePeopleTopic;
  },

  // ── Member mutations ───────────────────────────────────────────────────────

  async createPeopleMember(data) {
    const res = await gql(`
      mutation CreatePeopleMember($data: PeopleMemberInput!) {
        createPeopleMember(data: $data) { ${MEMBER_FIELDS} }
      }
    `, { data });
    return res.createPeopleMember;
  },

  async updatePeopleMember(id, data) {
    const res = await gql(`
      mutation UpdatePeopleMember($id: Int!, $data: PeopleMemberUpdateInput!) {
        updatePeopleMember(id: $id, data: $data) { ${MEMBER_FIELDS} }
      }
    `, { id, data });
    return res.updatePeopleMember;
  },

  async deletePeopleMember(id) {
    const res = await gql(`
      mutation DeletePeopleMember($id: Int!) {
        deletePeopleMember(id: $id)
      }
    `, { id });
    return res.deletePeopleMember;
  },

  // ── File upload ────────────────────────────────────────────────────────────

  async uploadMemberImage(file) {
    const path = await uploadImageHelper(file);
    const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
    return { path, url: `${BASE}/${path}` };
  },
};
