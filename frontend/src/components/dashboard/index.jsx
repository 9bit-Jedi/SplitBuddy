import { Container, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGroupExpensesService } from '../../services/expenseServices';
import { getUserGroupsService } from '../../services/groupServices';
import Loading from '../loading';
import { CalenderExpenseGraph } from './CalenderExpenseGraph';
import { CategoryExpenseChart } from './CategoryExpenseGraph';
import { MonthlyExpenseGraph } from './MonthlyExpenseGraph';
import { EndMessage } from './endMessage';
import { GroupExpenseChart } from './GroupExpenseChart';
import { RecentTransactions } from './RecentTransactions';
import { SummaryCards } from './summaryCards';
import { WelcomeMessage } from './welcomeMessage';
import { Link as RouterLink } from 'react-router-dom';
import configData from '../../config.json';
// import AlertBanner from "../AlertBanner"
import FavouriteGroups from './FavouriteGroups';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const profile = JSON.parse(localStorage.getItem('profile'));
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [userExp, setUserExp] = useState();
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);
      const response_group = await getUserGroupsService(
        setAlert,
        setAlertMessage,
      );
      if (response_group.length === 0) {
        setNewUser(true);
      } else {
        // Assuming the first group is the one we want to fetch expenses for.
        // This might need to be adjusted based on the desired UX.
        const response_expense = await getGroupExpensesService(
          response_group[0].id,
          setAlert,
          setAlertMessage,
        );
        setUserExp(response_expense);
      }
      setLoading(false);
    };
    getUserDetails();
  }, []);

  return (
    <Container maxWidth={'xl'}>
      {loading ? (
        <Loading />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <WelcomeMessage />
          </Grid>

          {newUser ? (
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 5 }}>
                <img src="/static/illustrations/illustration_empty_content.svg" alt="no groups" style={{ height: 240, margin: 'auto' }} />
                <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                    No groups yet!
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Get started by creating a new group.
                </Typography>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to={configData.CREATE_GROUP_URL}
                    sx={{ mt: 3 }}
                >
                    Create Group
                </Button>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={8}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <SummaryCards userTotalExp={userExp?.total} />
                  </Grid>
                  <Grid item xs={12}>
                    <FavouriteGroups />
                  </Grid>
                  <Grid item xs={12}>
                    <CalenderExpenseGraph />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CategoryExpenseChart />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MonthlyExpenseGraph />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {/* <RecentTransactions /> */}
                  </Grid>
                  <Grid item xs={12}>
                    <GroupExpenseChart />
                  </Grid>
                  <Grid item md={12} xs={0}>
                    <EndMessage />
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Container>
  );
}
