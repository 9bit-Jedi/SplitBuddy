import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, color }) => ({
  color: theme.palette[color].darker,
  backgroundColor: theme.palette[color].lighter,
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
}));

const MiniGroupCard = ({ title, share, currencyType, color = 'primary' }) => {
  return (
    <StyledCard color={color}>
      <Typography variant="h3">{`${share} ${currencyType}`}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </StyledCard>
  );
};

export default MiniGroupCard;
