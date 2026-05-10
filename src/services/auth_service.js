// src/services/auth_service.js
import { gql } from "./helper";

export const authService = {
  async login(username, password) {
    const data = await gql(`
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          token tokenType username fullName isSuperadmin
        }
      }
    `, { username, password });
    return data.login;
  },

  async registerAdmin({ username, email, password, fullName, isSuperadmin }) {
    const data = await gql(`
      mutation Register(
        $username: String!, $email: String!, $password: String!,
        $fullName: String, $isSuperadmin: Boolean
      ) {
        registerAdmin(
          username: $username, email: $email, password: $password,
          fullName: $fullName, isSuperadmin: $isSuperadmin
        ) {
          id username email fullName isActive isSuperadmin
        }
      }
    `, { username, email, password, fullName, isSuperadmin });
    return data.registerAdmin;
  },

  async listAdmins() {
    const data = await gql(`
      query { listAdmins { id username email fullName isActive isSuperadmin } }
    `);
    return data.listAdmins;
  },

  async deactivateAdmin(userId) {
    const data = await gql(`
      mutation Deactivate($userId: Int!) { deactivateAdmin(userId: $userId) }
    `, { userId });
    return data.deactivateAdmin;
  },

  async changePassword(oldPassword, newPassword) {
    const data = await gql(`
      mutation Change($oldPassword: String!, $newPassword: String!) {
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
      }
    `, { oldPassword, newPassword });
    return data.changePassword;
  },
};