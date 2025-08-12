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
import { createExpense } from '../../api';
import AlertBanner from '../AlertBanner';
import { useParams } from 'react-router-dom';

export const CreateExpense = () => {
  const { groupId } = useParams();
  const [values, setValues] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    category: 'General',
    paid_by: '',
    splits: [],
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
      await createExpense({ ...values, group: groupId });
      // You might want to refresh the group details here
    } catch (error) {
      setAlert(true);
      setAlertMessage(error.response?.data?.message || 'Failed to create expense');
    }
  };

  return (
    <Card>
      <CardHeader title="Create Expense" />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                onChange={handleChange}
                required
                value={values.description}
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
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Paid By"
                name="paid_by"
                onChange={handleChange}
                required
                value={values.paid_by}
                variant="outlined"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Button color="primary" variant="contained" type="submit">
                Create Expense
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
    </Card>
  );
};

export default CreateExpense;
