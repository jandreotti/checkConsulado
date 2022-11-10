import moment from 'moment';

export const momento = () => moment().format('DD/MM/YYYY HH:mm:ss');
export const momentoFormateado = (format: string) => moment().format(format);
export const momentoSecondsToTime = segundos => moment.utc(segundos * 1000).format('DHH:mm:ss');

export const momentoSecondsToTime2 = segundos => {
	let d = (segundos / 8.64e4) | 0;
	let H = ((segundos % 8.64e4) / 3.6e3) | 0;
	let m = ((segundos % 3.6e3) / 60) | 0;
	let s = segundos % 60;
	let z = n => (n < 10 ? '0' : '') + n;
	return `${d}d ${z(H)}:${z(m)}:${z(s)}`;
};

export const wait = time => new Promise(resolve => setTimeout(resolve, time));
