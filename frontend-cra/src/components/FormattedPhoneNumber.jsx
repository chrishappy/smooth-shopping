/**
 * Formats a telephone string (US/Canada)
 */

const FormattedPhoneNumber = ({phone}) => {
  const formattedPhone = formatPhoneNumber(phone);

  return <span class="formatted-phone-number">
    {formattedPhone}
  </span>

}

export default FormattedPhoneNumber;

// Source: https://stackoverflow.com/a/8358141
// Author: maerics (https://stackoverflow.com/users/244128/maerics)
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '');
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
}
// End source
