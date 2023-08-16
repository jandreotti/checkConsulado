import fs from 'fs';

export const log = (mensaje: string, archivo: string = "log.txt") => {

	fs.appendFile(archivo, mensaje + "\n", function (err) {
		if (err) throw err;
		// console.log('Saved!');
	});

};
