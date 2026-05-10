// services/district_service.js
import { gql, uploadImage } from "./helper";

export const districtService = {

  getAll: async (language = "en", activeOnly = null) => {
    const data = await gql(`
      query GetAllDistricts($language: String, $activeOnly: Boolean) {
        getAllDistricts(language: $language, activeOnly: $activeOnly) {
          id area areaWide activeFishermen fisheriesFamilies
          multidayBoats smallFiberGlassBoats mechanizedTraditional
          nonMechanizedTraditional odayBoats beachSeinBoats
          landingSites image imageUrl googleMapsLink active
          adImage adImageUrl nameEn nameSi nameTa
          positions {
            id areaId name number position subarea
          }
        }
      }
    `, { language, activeOnly });
    return data.getAllDistricts;
  },

  getById: async (id, language = "en") => {
    const data = await gql(`
      query GetDistrict($id: Int!, $language: String) {
        getDistrictById(id: $id, language: $language) {
          id area areaWide activeFishermen fisheriesFamilies
          multidayBoats smallFiberGlassBoats mechanizedTraditional
          nonMechanizedTraditional odayBoats beachSeinBoats
          landingSites image imageUrl googleMapsLink active
          adImage adImageUrl nameEn nameSi nameTa
          positions {
            id areaId name number position subarea
          }
        }
      }
    `, { id, language });
    return data.getDistrictById;
  },

  create: async (fields) => {
    const image = fields.image instanceof File
      ? await uploadImage(fields.image)
      : fields.image ?? null;

    // ── NEW: handle ad_image upload ──
    const adImage = fields.adImage instanceof File
      ? await uploadImage(fields.adImage)
      : fields.adImage ?? null;

    const data = await gql(`
      mutation CreateDistrict($data: DistrictInput!) {
        createDistrict(data: $data) {
          id area imageUrl adImageUrl nameEn nameSi nameTa active
        }
      }
    `, {
      data: {
        area:                      fields.area,
        areaWide:                  fields.areaWide                 ?? null,
        activeFishermen:           fields.activeFishermen          ?? null,
        fisheriesFamilies:         fields.fisheriesFamilies        ?? null,
        multidayBoats:             fields.multidayBoats            ?? null,
        smallFiberGlassBoats:      fields.smallFiberGlassBoats     ?? null,
        mechanizedTraditional:     fields.mechanizedTraditional    ?? null,
        nonMechanizedTraditional:  fields.nonMechanizedTraditional ?? null,
        odayBoats:                 fields.odayBoats                ?? null,
        beachSeinBoats:            fields.beachSeinBoats           ?? null,
        landingSites:              fields.landingSites             ?? null,
        image,
        googleMapsLink:            fields.googleMapsLink           ?? null,
        active:                    fields.active                   ?? true,
        // ── NEW ──────────────────────────────────────
        adImage,
        nameEn:                    fields.nameEn                   ?? null,
        nameSi:                    fields.nameSi                   ?? null,
        nameTa:                    fields.nameTa                   ?? null,
        // ─────────────────────────────────────────────
      },
    });
    return data.createDistrict;
  },

  update: async (id, fields) => {
    const image = fields.image instanceof File
      ? await uploadImage(fields.image)
      : fields.image ?? null;

    // ── NEW: handle ad_image upload ──
    const adImage = fields.adImage instanceof File
      ? await uploadImage(fields.adImage)
      : fields.adImage ?? null;

    const data = await gql(`
      mutation UpdateDistrict($id: Int!, $data: DistrictUpdateInput!) {
        updateDistrict(id: $id, data: $data) {
          id area imageUrl adImageUrl nameEn nameSi nameTa active
        }
      }
    `, {
      id,
      data: {
        area:                      fields.area                     ?? null,
        areaWide:                  fields.areaWide                 ?? null,
        activeFishermen:           fields.activeFishermen          ?? null,
        fisheriesFamilies:         fields.fisheriesFamilies        ?? null,
        multidayBoats:             fields.multidayBoats            ?? null,
        smallFiberGlassBoats:      fields.smallFiberGlassBoats     ?? null,
        mechanizedTraditional:     fields.mechanizedTraditional    ?? null,
        nonMechanizedTraditional:  fields.nonMechanizedTraditional ?? null,
        odayBoats:                 fields.odayBoats                ?? null,
        beachSeinBoats:            fields.beachSeinBoats           ?? null,
        landingSites:              fields.landingSites             ?? null,
        image,
        googleMapsLink:            fields.googleMapsLink           ?? null,
        active:                    fields.active                   ?? null,
        // ── NEW ──────────────────────────────────────
        adImage,
        nameEn:                    fields.nameEn                   ?? null,
        nameSi:                    fields.nameSi                   ?? null,
        nameTa:                    fields.nameTa                   ?? null,
        // ─────────────────────────────────────────────
      },
    });
    return data.updateDistrict;
  },

  delete: async (id) => {
    const data = await gql(`
      mutation DeleteDistrict($id: Int!) {
        deleteDistrict(id: $id)
      }
    `, { id });
    return data.deleteDistrict;
  },

  // ── DistrictPosition ───────────────────────────────────────────────────────

  getAllPositions: async (areaId = null, language = "en") => {
    const data = await gql(`
      query GetAllDistrictPositions($areaId: Int, $language: String) {
        getAllDistrictPositions(areaId: $areaId, language: $language) {
          id areaId name number position subarea
        }
      }
    `, { areaId, language });
    return data.getAllDistrictPositions;
  },

  getPositionById: async (id, language = "en") => {
    const data = await gql(`
      query GetDistrictPosition($id: Int!, $language: String) {
        getDistrictPositionById(id: $id, language: $language) {
          id areaId name number position subarea
        }
      }
    `, { id, language });
    return data.getDistrictPositionById;
  },

  createPosition: async ({ areaId, name, number, position, subarea }) => {
    const data = await gql(`
      mutation CreateDistrictPosition($data: DistrictPositionInput!) {
        createDistrictPosition(data: $data) {
          id areaId name number position subarea
        }
      }
    `, {
      data: {
        areaId,
        name,
        number:   number   ?? null,
        position: position ?? null,
        subarea:  subarea  ?? null,
      },
    });
    return data.createDistrictPosition;
  },

  updatePosition: async (id, { areaId, name, number, position, subarea }) => {
    const data = await gql(`
      mutation UpdateDistrictPosition($id: Int!, $data: DistrictPositionUpdateInput!) {
        updateDistrictPosition(id: $id, data: $data) {
          id areaId name number position subarea
        }
      }
    `, {
      id,
      data: {
        areaId:   areaId   ?? null,
        name:     name     ?? null,
        number:   number   ?? null,
        position: position ?? null,
        subarea:  subarea  ?? null,
      },
    });
    return data.updateDistrictPosition;
  },

  deletePosition: async (id) => {
    const data = await gql(`
      mutation DeleteDistrictPosition($id: Int!) {
        deleteDistrictPosition(id: $id)
      }
    `, { id });
    return data.deleteDistrictPosition;
  },

};