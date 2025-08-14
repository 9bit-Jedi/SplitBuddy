import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getUserGroupsService } from '../../services/groupServices';
import Loading from '../loading';
import GroupCards from './groupCards';
import configData from '../../config.json';
import AlertBanner from '../AlertBanner';

export default function Group() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchUserGroups = async () => {
      setLoading(true);
      const userGroups = await getUserGroupsService(setAlert, setAlertMessage);
      if (userGroups) {
        setGroups(userGroups);
      }
      setLoading(false);
    };
    fetchUserGroups();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Your Groups
      </Typography>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
      {loading ? (
        <Loading />
      ) : (
        <Grid container spacing={3}>
          {groups.map((group) => (
            <Grid key={group.id} item xs={12} sm={6} md={4}>
              <Link component={RouterLink} to={`${configData.VIEW_GROUP_URL}${group.id}`} sx={{ textDecoration: 'none' }}>
                <GroupCards
                  title={group.name}
                  description={group.description}
                  groupMembers={group.members}
                  share={group.user_balance}
                  currencyType={group.currency}
                  groupCategory={group.category}
                  isGroupActive={parseFloat(group.user_balance) !== 0.0}
                  color="primary"
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}