import { Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';

UserDetails.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default function UserDetails({ user }) {
  return (
    <Stack spacing={3}>
      <TextField
        disabled
        id="outlined-username"
        label="Username"
        value={user?.username || ''}
        fullWidth
      />
      <TextField
        disabled
        id="outlined-email"
        label="Email address"
        value={user?.email || ''}
        fullWidth
      />
    </Stack>
  );
}
