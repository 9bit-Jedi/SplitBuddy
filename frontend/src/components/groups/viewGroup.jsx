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
import { getGroupDetails } from '../../api';
import AlertBanner from '../AlertBanner';
import Loading from '../loading';
import AddMember from './AddMember';
import UpdateMember from './UpdateMember';
import RemoveMember from './RemoveMember';
import SimplifyDebts from './SimplifyDebts';
import CreateSettlement from './CreateSettlement';
import CreateExpense from '../expense/CreateExpense';

export const ViewGroup = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const fetchGroupDetails = async () => {
    try {
      const response = await getGroupDetails(groupId);
      setGroup(response.data);
    } catch (error) {
      setAlert(true);
      setAlertMessage(error.response?.data?.message || 'Failed to fetch group details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
      {group && (
        <Grid container spacing={3}>
          <Grid item lg={8} md={6} xs={12}>
            <Card>
              <CardHeader title={group.name} subheader={group.description} />
              <Divider />
              <CardContent>
                <Typography variant="h6">Members</Typography>
                <Box>
                  {group.members.map((member) => (
                    <Typography key={member.id}>{member.username}</Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
            <Box mt={3}>
              <SimplifyDebts />
            </Box>
            <Box mt={3}>
              <CreateExpense />
            </Box>
          </Grid>
          <Grid item lg={4} md={6} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AddMember />
              </Grid>
              <Grid item xs={12}>
                <UpdateMember />
              </Grid>
              <Grid item xs={12}>
                <RemoveMember />
              </Grid>
              <Grid item xs={12}>
                <CreateSettlement />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ViewGroup;
