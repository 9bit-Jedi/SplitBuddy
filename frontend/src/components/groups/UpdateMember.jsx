import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from '@mui/material';
import { updateGroupMember } from '../../api';
import AlertBanner from '../AlertBanner';
import { useParams } from 'react-router-dom';

export const UpdateMember = () => {
  const { groupId } = useParams();
  const [values, setValues] = useState({
    user_id: '',
    role: '',
  });
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateGroupMember(groupId, values);
      // You might want to refresh the group details here
    } catch (error) {
      setAlert(true);
      setAlertMessage(error.response?.data?.message || 'Failed to update member');
    }
  };

  return (
    <Card>
      <CardHeader title="Update Member Role" />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="User ID"
                name="user_id"
                onChange={handleChange}
                required
                value={values.user_id}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Role"
                name="role"
                onChange={handleChange}
                required
                value={values.role}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Button color="primary" variant="contained" type="submit">
                Update Member
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
    </Card>
  );
};

export default UpdateMember;
