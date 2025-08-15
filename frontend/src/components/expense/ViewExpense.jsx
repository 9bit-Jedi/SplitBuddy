import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { getExpenseDetails } from '../../api';
import AlertBanner from '../AlertBanner';
import Loading from '../loading';
import SettleExpense from './SettleExpense';

export const ViewExpense = () => {
  const { expenseId } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const response = await getExpenseDetails(expenseId);
        setExpense(response.data);
      } catch (error) {
        setAlert(true);
        setAlertMessage(
          error.response?.data?.message || 'Failed to fetch expense details',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchExpenseDetails();
  }, [expenseId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />
      {expense && (
        <Card>
          <CardHeader title={expense.description} />
          <Divider />
          <CardContent>
            <Typography>Amount: {expense.amount}</Typography>
            <Typography>Paid by: {expense.paid_by}</Typography>
            <Typography>Category: {expense.category}</Typography>
            <Box mt={2}>
              <SettleExpense expenseId={expense.id} />
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ViewExpense;
