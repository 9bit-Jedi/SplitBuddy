import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';
import { getSimplifiedDebts } from '../../api';
import AlertBanner from '../AlertBanner';
import { useParams } from 'react-router-dom';
import Loading from '../loading';

export const SimplifyDebts = () => {
  const { groupId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const fetchSimplifiedDebts = async () => {
    try {
      const response = await getSimplifiedDebts(groupId);
      setPayments(response.data.payments);
    } catch (error) {
      setAlert(true);
      setAlertMessage(error.response?.data?.message || 'Failed to fetch simplified debts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimplifiedDebts();
  }, [groupId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader title="Simplified Debts" />
      <Divider />
      <CardContent>
        <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
        {payments.length > 0 ? (
          payments.map((payment, index) => (
            <Typography key={index}>
              {payment.from} owes {payment.to} ${payment.amount}
            </Typography>
          ))
        ) : (
          <Typography>No debts to settle.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default SimplifyDebts;
