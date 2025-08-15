import { useState } from 'react';
import { Button } from '@mui/material';
import { settleExpense } from '../../api';
import AlertBanner from '../AlertBanner';

export const SettleExpense = ({ expenseId }) => {
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSettleExpense = async () => {
    try {
      await settleExpense(expenseId);
      // You might want to refresh the expense details here
    } catch (error) {
      setAlert(true);
      setAlertMessage(
        error.response?.data?.message || 'Failed to settle expense',
      );
    }
  };

  return (
    <>
      <Button color="primary" variant="contained" onClick={handleSettleExpense}>
        Settle Expense
      </Button>
      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />
    </>
  );
};

export default SettleExpense;
