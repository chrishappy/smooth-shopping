
import { getDay } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz"
import { hasExistentProperty } from "./genericHelper";


// Order times and messages
const openTimesAndMessages = {
  '0': { // Sunday
    open: false,
    message: 'Closed until Tues.',
  },
  '1': { // Monday
    open: false,
    message: 'Closed until Tues. Updating the menu.',
  },
  '2': { // Tuesday
    open: true,
    message: 'Open! Now accepting new orders until Wed.',
  },
  '3': { // Wednesday
    open: true,
    message: 'Open! Last day to place your order!',
  },
  '4': { // Thursday
    open: false,
    message: 'Closed until Tues. Processing orders for tomorrow!',
  },
  '5': { // Friday
    open: false,
    message: 'Closed until Tues. Come pick up your order!',
  },
  '6': { // Saturday
    open: false,
    message: 'Closed until Tues.',
  },
}

/**
 * Get order message of day
 */
export const getOrderMessageOfDay = (dayOfWeek) => {
  dayOfWeek = dayOfWeek + ''; // Convert to string

  if (hasExistentProperty(openTimesAndMessages, dayOfWeek)) {
    return openTimesAndMessages[dayOfWeek].message;
  }
  else {
    return null;
  }
}

/**
 * Get whether a day is open
 */
export const isOrderOpenOnDay = (dayOfWeek) => {
  dayOfWeek = dayOfWeek + ''; // Convert to string

  if (hasExistentProperty(openTimesAndMessages, dayOfWeek)) {
    return openTimesAndMessages[dayOfWeek].open;
  }
  else {
    return null;
  }
}

/**
 * Store whether the ordering system is open or not
 * 
 * @returns boolean
 */
export const orderingSystemIsOpenToday = () => {
  const zonedNow = zonedTimeToUtc(new Date(), 'America/Vancouver');
  const dayOfTheWeek = 4; //getDay(zonedNow);

  return isOrderOpenOnDay(dayOfTheWeek);
}

/**
 * Store whether the ordering system is open or not
 * 
 * @returns boolean
 */
export const orderingSystemMessageForToday = () => {
  const zonedNow = zonedTimeToUtc(new Date(), 'America/Vancouver');
  const dayOfTheWeek = 4; //getDay(zonedNow);

  return getOrderMessageOfDay(dayOfTheWeek);
}
