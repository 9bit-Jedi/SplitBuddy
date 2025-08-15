import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Link, Card, alpha } from '@mui/material';
import Iconify from "../Iconify";
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
      <AlertBanner
        showAlert={alert}
        alertMessage={alertMessage}
        severity="error"
      />
      {loading ? (
        <Loading />
      ) : (
        <Grid container spacing={3}>
          {groups.map((group) => (
            <Grid key={group.id} item xs={12} sm={6} md={4}>
              <Link
                component={RouterLink}
                to={`${configData.VIEW_GROUP_URL}${group.id}`}
                sx={{ textDecoration: 'none' }}
              >
                <GroupCards
                  title={group.name}
                  description={group.description}
                  groupMembers={group.members}
                  share={group.user_balance.amount}
                  currencyType={group.currency}
                  groupCategory={group.category}
                  isGroupActive={parseFloat(group.user_balance) !== 0.0}
                  color="primary"
                />
              </Link>
            </Grid>
          ))}
          <Grid item xs={12} md={6} lg={6}>
            <Link component={RouterLink}
              to={configData.CREATE_GROUP_URL}
              sx={{ textDecoration: 'none' }}
            >
              <Card
                sx={{
                  p: 0,
                  boxShadow: 10,
                  borderRadius: 2,
                  backgroundImage: (theme) =>
                    `linear-gradient(169deg, ${alpha(theme.palette['primary'].light, 0.6)} 0%, ${alpha(
                      theme.palette['primary'].darker,
                      0.55
                    )} 70%)`,
                  minHeight: 310
                }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  minHeight={310}
                >
                  <Grid item xs={'auto'} md={'auto'} >
                    <Iconify icon="fluent:people-team-add-20-filled" color={'#fff'} sx={{
                      width: '100%',
                      height: 50
                    }} />
                    <Typography variant="h4" fontSize={28} color='#fff' sx={{
                      width: '100%', textDecoration: 'none'
                    }}>
                      Create new group!
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Link>
          </Grid>
          
        </Grid>
      )}
    </Container>
  );
}
