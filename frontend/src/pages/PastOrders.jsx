import React from 'react';
import { useQuery } from "@apollo/client";
import MainContentLoader from "../components/MainContentLoader";
import { IconButton, Stack, Typography, Accordion, AccordionSummary, AccordionDetails, Box, Table, TableRow, TableCell, TableBody } from "@mui/material"
import { GET_USERS_ORDERS } from "../helpers/queries";
import CachedIcon from '@mui/icons-material/Cached';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format, parseISO } from 'date-fns';
import { formatFloat } from '../helpers/genericHelper';

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
  const pastOrders = data.orders;

  return (
    <>
      <Stack 
        direction="row" 
        sx={{ alignContent: 'center', justifyContent: 'space-between', mb: 3 }}>
        <h1>Past Orders</h1>
        <div>
          <IconButton
            color="primary"
            aria-label={'Refresh page'}
            onClick={() => {
              refetch();
            }} >
            <CachedIcon />
          </IconButton>
        </div>
      </Stack>

      {/* <Typography component="div" variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
        { pastOrders.length } orders
      </Typography>
      <hr /> */}
      <Box sx={{ display: 'flex', flexDirection: 'row', padding: '0.4em 0.8em', backgroundColor: '#444', }}>
        <Typography 
          sx={{ width: '73%', fontWeight: 'bold', fontSize: '0.9em', color: '#f7f1f1' }}>Date of Order</Typography>
        <Typography
          sx={{ fontWeight: 'bold', fontSize: '0.9em', color: '#f7f1f1' }}>Total</Typography>
      </Box>

      {pastOrders.map((order) => (
        <Accordion key={order.id} disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id={order.id} // id="panel1bh-header"
            sx={{ background: '#eee'}}
          >
            <Typography sx={{ width: '80%', flexShrink: 0 }}>{format(parseISO(order.created), 'PP p')}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>${order.fieldTotalOrderAmount}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table sx={{ fontSize: '0.95em', margin: 0 }} size="small">
              <TableBody>
                {order.fieldOrderItems.map((item) => (
                  <TableRow key={item.id} >
                    <TableCell >{item.fieldProduct.title}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', textAlign: 'right', padding: 0 }}>{formatFloat(item.fieldQuantity)}</TableCell>
                    <TableCell sx={{
                      color: 'text.secondary', 
                      textAlign: 'center', 
                      padding: '0 0.4em', 
                      width: 0
                    }}>x</TableCell>
                    <TableCell  sx={{ color: 'text.secondary', textAlign: 'right', padding: 0, width: 0 }}>${formatFloat(item.fieldProduct.fieldCredit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{padding: '2em 0'}}></Box>
    </>
  )
}

export default PastOrders;