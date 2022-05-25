

/**
 * Format Address
 * Input:
 * @code
 * {
 *   province: '',
 *   city: '',
 *   postalCode: '',
 *   addressLine1: '',
 *   addressLine2: '',
 * }
 * @endcode
 */

const FormattedAddress = ({address}) => {
  return <span>
      {address.addressLine1} <br />
      {address.addressLine2.length > 0 ? <br /> : ''} 
      {address.city} {address.province} <br />
      {address.postalCode}
    </span>
};

export default FormattedAddress;