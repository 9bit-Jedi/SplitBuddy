import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { createExpense } from '../../api';
import { getGroupDetailsService } from '../../services/groupServices';
import AlertBanner from '../AlertBanner';
import { useParams, useNavigate } from 'react-router-dom';
import configData from '../../config.json';

const currencies = ['USD', 'INR', 'EUR'];
const categories = ['Food', 'Travel', 'Utilities', 'Entertainment', 'General'];

export const CreateExpense = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupMembers, setGroupMembers] = useState([]);
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

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const groupDetails = await getGroupDetailsService(groupId, setAlert, setAlertMessage);
        if (groupDetails && groupDetails.members) {
          setGroupMembers(groupDetails.members);
          const currentUser = JSON.parse(localStorage.getItem('profile'));
          // Find the current user in the members list to set as default payer
          const currentUserInGroup = groupDetails.members.find(member => member.username === currentUser.user.username);
          if (currentUserInGroup) {
            setValues(v => ({ ...v, paid_by: currentUserInGroup.id }));
          }
        }
      } catch (error) {
        // The service function already handles setting the alert state
      }
    };
    fetchGroupMembers();
  }, [groupId]);

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
      navigate(`${configData.VIEW_GROUP_URL}${groupId}`);
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
                type="number"
                onChange={handleChange}
                required
                value={values.amount}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="currency-label">Currency</InputLabel>
                <Select
                  labelId="currency-label"
                  id="currency"
                  name="currency"
                  value={values.currency}
                  label="Currency"
                  onChange={handleChange}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={values.category}
                  label="Category"
                  onChange={handleChange}
                >
                  {categories.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="paid_by-label">Paid By</InputLabel>
                <Select
                  labelId="paid_by-label"
                  id="paid_by"
                  name="paid_by"
                  value={values.paid_by}
                  label="Paid By"
                  onChange={handleChange}
                  required
                >
                  {groupMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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