import { useContext } from 'react'
import UserContext from './UserContext'
// Custom hook
export function useUser() {
    return useContext(UserContext)
}
/*
useUser is a custom React hook that provides easy access to user context.
It returns the current user, loading state, and any context functions (like refreshUser).
instead of importing useContext and UserContext every time
we can just import useUser and call it to get user data

example usage for later:

import { useUser } from './authentication/useUser';

function Profile() {
  const { user, isLoading, refreshUser } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in.</div>;

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <button onClick={refreshUser}>Refresh</button>
    </div>
  );
}

This lets you read the current user, loading state, and call context functions without manually passing props.
 Just call useUser() anywhere inside a component wrapped by UserProvider
*/
