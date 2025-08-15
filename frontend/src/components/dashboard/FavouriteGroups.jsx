import styled from '@emotion/styled';
import { Box, Grid, Link, Typography } from '@mui/material';

import React, { useState, useEffect } from 'react';
import { getUserGroupsService } from '../../services/groupServices';
import Loading from '../loading';
import dataConfig from '../../config.json';
import { Link as RouterLink } from 'react-router-dom';
import MiniGroupCard from '../groups/miniGroupCard';

const FavouriteGroups = () => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getUserFavGroups = async () => {
      setLoading(true);
      const response_groups = await getUserGroupsService();
      if (response_groups) {
        setGroups(response_groups);
      }
      setLoading(false);
    };
    getUserFavGroups();
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            p: 5,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 5,
          }}
        >
          <Typography variant="h6" mb={2}>
            Groups
          </Typography>
          <Grid container spacing={4}>
            {groups?.map((myGroup) => {
              return (
                <Grid item xs={12} md={12} lg={6} key={myGroup?.id}>
                  <Link
                    component={RouterLink}
                    to={dataConfig.VIEW_GROUP_URL + myGroup?.id}
                    sx={{ textDecoration: 'none' }}
                  >
                    <MiniGroupCard
                      title={myGroup?.name}
                      share={myGroup?.user_balance.amount}
                      currencyType={myGroup?.user_balance.currency}
                      color="info"
                    />
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default FavouriteGroups;
