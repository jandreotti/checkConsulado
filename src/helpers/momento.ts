import moment from 'moment';

export const momento = () => moment().format('DD/MM/YYYY HH:mm:ss');

export const wait = time => new Promise(resolve => setTimeout(resolve, time));
