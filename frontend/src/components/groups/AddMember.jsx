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
import { addGroupMember } from '../../api';
import AlertBanner from '../AlertBanner';
import { useParams } from 'react-router-dom';

export const AddMember = () => {
  const { groupId } = useParams();
  const [values, setValues] = useState({
    username: '',
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
      await addGroupMember(groupId, values);
      // You might want to refresh the group details here
    } catch (error) {
      setAlert(true);
      setAlertMessage(error.response?.data?.message || 'Failed to add member');
    }
  };

  return (
    <Card>
      <CardHeader title="Add Member" />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                onChange={handleChange}
                required
                value={values.username}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Button color="primary" variant="contained" type="submit">
                Add Member
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
    </Card>
  );
};

export default AddMember;
