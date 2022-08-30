import { GET_ORDER_IDS_OF_PAST_WEEK } from "../helpers/queries";
import { hasExistentProperty } from "../helpers/genericHelper";
import { useQuery } from "@apollo/client";

const SystemMessageOrderIds = ({ sevenDaysAgoTimestamp }) => {
  const { data, loading, error } = useQuery(GET_ORDER_IDS_OF_PAST_WEEK, {
    variables: {
      sevenDaysAgoTimestamp
    },
  });

  if (loading) return '';

  if (error) return error;

  const orderIds = [];

  if (hasExistentProperty(data, 'getPastOrderIds')) {
    data.getPastOrderIds.forEach((curr) => {
      orderIds.push(curr.nid);
    })
  }

  return (
    <>
      {(orderIds.length > 0) && 
        <div className="order-number">
          <div className="order-number__label">Order Number</div>
          <div className="order-number__ids">
            #{orderIds.join(', #')}
          </div>
        </div>
      }
    </>
  )
}
export default SystemMessageOrderIds;
