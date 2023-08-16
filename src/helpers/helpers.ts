import fs from 'fs';

export const log = (mensaje: string, archivo: string = "log.txt") => {

	fs.appendFile(archivo, mensaje, function (err) {
		if (err) throw err;
		// console.log('Saved!');
	});

};
