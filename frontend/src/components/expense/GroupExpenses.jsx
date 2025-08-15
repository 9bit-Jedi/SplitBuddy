import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';
import { getGroupExpenses } from '../../api';
import AlertBanner from '../AlertBanner';
import { useParams } from 'react-router-dom';
import Loading from '../loading';

export const GroupExpenses = () => {
  const { groupId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchGroupExpenses = async () => {
      try {
        const response = await getGroupExpenses(groupId);
        setExpenses(response.data.expenses);
      } catch (error) {
        setAlert(true);
        setAlertMessage(
          error.response?.data?.message || 'Failed to fetch group expenses',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchGroupExpenses();
  }, [groupId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader title="Group Expenses" />
      <Divider />
      <CardContent>
        <AlertBanner
          showAlert={alert}
          alertMessage={alertMessage}
          severity="error"
        />
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <Box key={expense.id} mb={2}>
              <Typography variant="h6">{expense.description}</Typography>
              <Typography>Amount: {expense.amount}</Typography>
              <Typography>Paid by: {expense.paid_by}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No expenses for this group yet.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupExpenses;
