import {
  getUserGroups,
  createGroup,
  getGroupDetails,
  addGroupMember,
  updateGroupMember,
  removeGroupMember,
  getSimplifiedDebts,
  createSettlement,
} from '../api';

export const getUserGroupsService = async (setAlert, setAlertMessage) => {
  try {
    const response = await getUserGroups();
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(
      error.response?.data?.message || 'Failed to fetch user groups',
    );
    window.scroll(0, 0);
  }
};

export const createGroupService = async (
  formData,
  setAlert,
  setAlertMessage,
) => {
  try {
    const response = await createGroup(formData);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to create group');
    window.scroll(0, 0);
  }
};

export const getGroupDetailsService = async (
  groupId,
  setAlert,
  setAlertMessage,
) => {
  try {
    const response = await getGroupDetails(groupId);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(
      error.response?.data?.message || 'Failed to fetch group details',
    );
    window.scroll(0, 0);
  }
};

export const addGroupMemberService = async (
  groupId,
  memberData,
  setAlert,
  setAlertMessage,
) => {
  try {
    const response = await addGroupMember(groupId, memberData);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to add member');
    window.scroll(0, 0);
  }
};

export const updateGroupMemberService = async (
  groupId,
  memberData,
  setAlert,
  setAlertMessage,
) => {
  try {
    const response = await updateGroupMember(groupId, memberData);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to update member');
    window.scroll(0, 0);
  }
};

export const removeGroupMemberService = async (
  groupId,
  memberData,
  setAlert,
  setAlertMessage,
) => {
  try {
    const response = await removeGroupMember(groupId, memberData);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to remove member');
    window.scroll(0, 0);
  }
};

export const getSimplifiedDebtsService = async (
  groupId,
  setAlert,
  setAlertMessage,
) => {
  try {
    const response = await getSimplifiedDebts(groupId);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(
      error.response?.data?.message || 'Failed to simplify debts',
    );
    window.scroll(0, 0);
  }
};

export const createSettlementService = async (
  groupId,
  settlementData,
  setAlert,
  setAlertMessage,
) => {
  try {
    const response = await createSettlement(groupId, settlementData);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(
      error.response?.data?.message || 'Failed to create settlement',
    );
    window.scroll(0, 0);
  }
};
