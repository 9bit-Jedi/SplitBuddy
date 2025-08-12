import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ExpenseCard = ({
  expenseName,
  expenseAmount,
  expensePerMember,
  expenseOwner,
  expenseDate,
  currencyType,
}) => {
  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{expenseName}</Typography>
          <Typography variant="h6">{`${expenseAmount} ${currencyType}`}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Paid by: {expenseOwner}</Typography>
          <Typography variant="body2">Your share: {expensePerMember}</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {new Date(expenseDate).toLocaleDateString()}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default ExpenseCard;
