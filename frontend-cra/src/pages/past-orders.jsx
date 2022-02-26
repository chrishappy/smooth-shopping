import { useQuery } from "@apollo/client";
import { IconButton, Stack } from "@mui/material"
import MainContentLoader from "../components/main-content-loader";
import { GET_USERS_ORDERS } from "../helpers/queries";
import CachedIcon from '@mui/icons-material/Cached';

const PastOrders = () => {

  const {loading, error, data, refetch} = useQuery(GET_USERS_ORDERS);

  if (error) {
    return (
      'There was an error'
    );
  }

  if (loading) {
    return (
      <MainContentLoader />
    )
  }

  return (
    <>
      <Stack 
        direction="row" 
        sx={{ alignContent: 'center', justifyContent: 'space-between' }}>
        <h1>Past Orders</h1>
        <div>
          <IconButton
            color="primary"
            aria-label={'Refresh page'}
            onClick={() => {
              console.log('Clear caches');
              refetch();
            }} >
            <CachedIcon />
          </IconButton>
        </div>
      </Stack>
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
    </>
  )
}

export default PastOrders;