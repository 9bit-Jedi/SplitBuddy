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
  Typography,
} from '@mui/material';
import { createGroup } from '../../api';
import AlertBanner from '../AlertBanner';
import { useNavigate } from 'react-router-dom';
import configData from '../../config.json';

export const CreateGroup = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
  });
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createGroup(values);
      navigate(configData.USER_GROUPS_URL);
    } catch (error) {
      setAlert(true);
      setAlertMessage(error.response?.data?.message || 'Failed to create group');
    }
  };

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Create a new group to start sharing expenses" title="Create Group" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Group Name"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                onChange={handleChange}
                value={values.description}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2,
          }}
        >
          <Button color="primary" variant="contained" type="submit">
            Create Group
          </Button>
        </Box>
      </Card>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
    </form>
  );
};

export default CreateGroup;
