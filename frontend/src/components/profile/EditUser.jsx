import { useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField, Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../Iconify';
import { updateUserService } from '../../services/auth';
import AlertBanner from '../AlertBanner';

EditUser.propTypes = {
  user: PropTypes.object,
  hideEditUser: PropTypes.func,
  onUserUpdate: PropTypes.func,
};

export default function EditUser({ user, hideEditUser, onUserUpdate }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profile_image_url: user?.profile_image_url || '',
  });
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await updateUserService(formData, setAlert, setAlertMessage);
    setLoading(false);
    if (response) {
      onUserUpdate(response.data);
      hideEditUser();
    }
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
        <TextField
          name="username"
          fullWidth
          type="text"
          label="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          name="email"
          fullWidth
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          name="profile_image_url"
          fullWidth
          type="text"
          label="Profile Image URL"
          value={formData.profile_image_url}
          onChange={handleChange}
        />
      </Stack>
      <Grid container spacing={2} mt={2} justifyContent={'center'}>
        <Grid item md={6} xs={11}>
          <Button
            startIcon={<Iconify icon="material-symbols:cancel" />}
            size="large"
            onClick={hideEditUser}
            variant="outlined"
            color={'error'}
            sx={{ width: '100%' }}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item md={6} xs={11}>
          <LoadingButton
            startIcon={<Iconify icon="teenyicons:tick-circle-solid" />}
            fullWidth
            size="large"
            type="submit"
            variant="outlined"
            loading={loading}
          >
            Update
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  );
}
