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
import { createSettlement } from '../../api';
import AlertBanner from '../AlertBanner';
import { useParams } from 'react-router-dom';

export const CreateSettlement = () => {
  const { groupId } = useParams();
  const [values, setValues] = useState({
    paid_to: '',
    amount: '',
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
      await createSettlement(groupId, values);
      // You might want to refresh the group details here
    } catch (error) {
      setAlert(true);
      setAlertMessage(error.response?.data?.message || 'Failed to create settlement');
    }
  };

  return (
    <Card>
      <CardHeader title="Create Settlement" />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Paid To"
                name="paid_to"
                onChange={handleChange}
                required
                value={values.paid_to}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                onChange={handleChange}
                required
                value={values.amount}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Button color="primary" variant="contained" type="submit">
                Create Settlement
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
    </Card>
  );
};

export default CreateSettlement;
