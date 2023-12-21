import moment from 'moment';

export default function monthDiff(startDate, endDate) {
  return Math.ceil(moment(new Date(endDate)).diff(new Date(startDate), 'months', true));
}
