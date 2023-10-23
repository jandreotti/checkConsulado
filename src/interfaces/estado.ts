export interface Estado {
	estado: 'INICIANDO' | 'LOADING' | 'AUTENTICADO' | 'ERROR DE AUTENTICACION' | 'QR' | 'LISTO';
	valor: Object;
	fecha?: Date;

}
