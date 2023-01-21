
import { getDay } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz"
import { hasExistentProperty } from "./genericHelper";


// Order times and messages
const openTimesAndMessages = {
  '0': { // Sunday
    message: 'Closed until Tues.',
  },
  '1': { // Monday
    message: 'Closed until Tues. Updating the menu.',
  },
  '2': { // Tuesday
    isOpen: true,
    message: 'Open! Now accepting new orders until Wed.',
  },
  '3': { // Wednesday
    isOpen: true,
    message: 'Open! Last day to place your order!',
  },
  '4': { // Thursday
    message: 'Closed until Tues. Preparing orders for tomorrow!',
  },
  '5': { // Friday
    isPickUpDay: true,
    message: 'Closed until Tues. Come pick up your order!',
  },
  '6': { // Saturday
    message: 'Closed until Tues.',
  },
}

/**
 * Get order message of day
 * @param dayOfWeek int 0 for Sunday, 6 for Saturday
 * @returns string
 */
const getOrderMessageOfDay = (dayOfWeek) => {
  dayOfWeek = dayOfWeek + ''; // Convert to string

  if (hasExistentProperty(openTimesAndMessages, dayOfWeek) &&
      hasExistentProperty(openTimesAndMessages[dayOfWeek], 'message')) {
    return openTimesAndMessages[dayOfWeek].message;
  }
  else {
    return '';
  }
}

/**
 * Get whether a day is open
 * @param dayOfWeek int 0 for Sunday, 6 for Saturday
 * @returns boolean
 */
const isOrderOpenOnDay = (dayOfWeek) => {
  dayOfWeek = dayOfWeek + ''; // Convert to string

  if (hasExistentProperty(openTimesAndMessages, dayOfWeek) &&
      hasExistentProperty(openTimesAndMessages[dayOfWeek], 'isOpen')) {
    return openTimesAndMessages[dayOfWeek].isOpen;
  }
  else {
    return false;
  }
}

/**
 * Get whether a day is pickup day
 * @param dayOfWeek int 0 for Sunday, 6 for Saturday
 * @returns boolean
 */
const isPickUpOrderDay = (dayOfWeek) => {
  dayOfWeek = dayOfWeek + ''; // Convert to string

  if (hasExistentProperty(openTimesAndMessages, dayOfWeek) &&
      hasExistentProperty(openTimesAndMessages[dayOfWeek], 'isPickUpDay')) {
    return openTimesAndMessages[dayOfWeek].isPickUpDay;
  }
  else {
    return false;
  }
}

/**
 * Returns whether the ordering system is open or not
 * 
 * @returns boolean
 */
export const isOrderingSystemIsOpenToday = () => {
  const zonedNow = zonedTimeToUtc(new Date(), 'America/Vancouver');
  const dayOfTheWeek = getDay(zonedNow);

  return isOrderOpenOnDay(dayOfTheWeek);
}

/**
 * Returns the Order Message of Today
 * 
 * @returns boolean
 */
export const orderingSystemMessageForToday = () => {
  const zonedNow = zonedTimeToUtc(new Date(), 'America/Vancouver');
  const dayOfTheWeek = getDay(zonedNow);

  return getOrderMessageOfDay(dayOfTheWeek);
}

/**
 * Returns whether to pick up orders today
 * 
 * @returns boolean
 */
export const isPickUpOrdersToday = () => {
  const zonedNow = zonedTimeToUtc(new Date(), 'America/Vancouver');
  const dayOfTheWeek = getDay(zonedNow);

  return isPickUpOrderDay(dayOfTheWeek);
}
