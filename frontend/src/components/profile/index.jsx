import { Container, Stack, Typography, Box, Avatar, Grid, Button, Link, Modal } from '@mui/material';
import gravatarUrl from 'gravatar-url';
import Iconify from '../Iconify';
import useResponsive from '../../theme/hooks/useResponsive';
import UserDetails from './UserDetails';
import { useState, useEffect } from 'react';
import { getUserService, deleteUserService } from '../../services/auth';
import Loading from '../loading';
import EditUser from './EditUser';
import AlertBanner from '../AlertBanner';
import configData from '../../config.json';
import ChangePassword from './ChangePassword';
import { useNavigate } from 'react-router-dom';

const modelStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

export default function Profile() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [editUser, setEditUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [changePass, setChangePass] = useState(false);

  const showEditUser = () => {
    setEditUser(true);
  };
  const hideEditUser = () => {
    setEditUser(false);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const deleteConfirmOpen = () => {
    setDeleteConfirm(true);
  };
  const deleteConfirmClose = () => {
    setDeleteConfirm(false);
  };

  const showPassUpdate = () => {
    setChangePass(true);
  };
  const hidePassUpdate = () => {
    setChangePass(false);
  };

  const apiDeleteCall = async () => {
    const response = await deleteUserService(setShowAlert, setAlertMessage);
    if (response) {
      navigate('/user-deleted');
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);
      const response = await getUserService(setShowAlert, setAlertMessage);
      if (response) {
        setUser(response.data);
      }
      setLoading(false);
    };
    getUserDetails();
  }, []);

  const getAvatarSrc = () => {
    if (user?.profile_image_url) {
      return user.profile_image_url;
    }
    if (user?.email) {
      return gravatarUrl(user.email, {
        size: 350,
        default: configData.USER_DEFAULT_LOGO_URL,
      });
    }
    return configData.USER_DEFAULT_LOGO_URL;
  };

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Typography variant="h5" component="h1">
            User Profile
          </Typography>
          <AlertBanner showAlert={showAlert} alertMessage={alertMessage} severity="error" />
          <Grid container spacing={3} p={4}>
            <Grid item xs={12} md={4} align="center">
              <Avatar src={getAvatarSrc()} alt="photoURL" sx={{ width: 240, height: 240 }} />
              <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
                *The profile picture is taken from Gravitar <br />
                <Link variant="subtitle3" component={'a'} href="https://en.gravatar.com/support/faq/" target="_blank">
                  Know how to set gravitar profile pic!
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 4 }}>
              {editUser ? (
                <EditUser user={user} hideEditUser={hideEditUser} onUserUpdate={handleUserUpdate} />
              ) : changePass ? (
                <ChangePassword hidePassUpdate={hidePassUpdate} emailId={user.email} />
              ) : (
                <>
                  <UserDetails user={user} />
                  <Grid container spacing={3} mt={1} justifyContent={'center'}>
                    <Grid item xs={11} md={3} order={{ xs: 3, md: 1 }}>
                      <Button
                        startIcon={<Iconify icon="fluent:delete-dismiss-24-filled" />}
                        variant="outlined"
                        color="error"
                        sx={{ width: '100%' }}
                        onClick={deleteConfirmOpen}
                      >
                        Delete
                      </Button>
                      <Modal
                        open={deleteConfirm}
                        onClose={deleteConfirmClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={modelStyle} width={mdUp ? 400 : '90%'}>
                          <Typography id="modal-modal-title" variant="h6" component="h2">
                            Confirm user deletion
                          </Typography>
                          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Are you sure you want to delte the user account?
                          </Typography>
                          <Stack mt={2} spacing={2} direction={'row'}>
                            <Button
                              startIcon={<Iconify icon="fluent:delete-dismiss-24-filled" />}
                              variant="outlined"
                              color="error"
                              sx={{ width: '100%' }}
                              onClick={apiDeleteCall}
                            >
                              Delete Account
                            </Button>
                            <Button
                              startIcon={<Iconify icon="material-symbols:cancel" />}
                              variant="outlined"
                              color="primary"
                              sx={{ width: '100%' }}
                              onClick={deleteConfirmClose}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Box>
                      </Modal>
                    </Grid>
                    <Grid item xs={11} md={5} order={{ xs: 2, md: 2 }}>
                      <Button
                        startIcon={<Iconify icon="mdi:form-textbox-password" />}
                        variant="outlined"
                        color="warning"
                        sx={{ width: '100%' }}
                        onClick={showPassUpdate}
                      >
                        Change Password
                      </Button>
                    </Grid>
                    <Grid item xs={11} md={4} order={{ xs: 1, md: 3 }}>
                      <Button
                        startIcon={<Iconify icon="clarity:edit-solid" />}
                        variant="outlined"
                        sx={{ width: '100%' }}
                        onClick={showEditUser}
                      >
                        Edit Details
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}