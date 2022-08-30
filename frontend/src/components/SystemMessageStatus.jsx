import { isOrderingSystemIsOpenToday, orderingSystemMessageForToday } from "../helpers/orderSystemStatus";

const SystemMessageStatus = () => {

  return (
    <div className={`header-order-status header-order-status--${isOrderingSystemIsOpenToday() ? 'open' : 'closed'}`}>
      {orderingSystemMessageForToday()}
    </div>
  )
}
export default SystemMessageStatus;
