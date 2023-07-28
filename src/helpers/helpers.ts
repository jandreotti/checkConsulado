import fs from 'fs';

export const log = (mensaje: string) => {
	fs.appendFile('log.txt', mensaje, function (err) {
		if (err) throw err;
		console.log('Saved!');
	});

};
