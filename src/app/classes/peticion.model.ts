export class Peticion{
    id_peticion! : number;
    sucursal_retiro! : number;
    sucursal_devolucion! : number;
    fecha_retiro! : Date | string;
    fecha_devolucion! : Date | string;
    codigo_retiro! : string;
    precio : number | undefined;
    auto_sucursal! : number;
    usuario! : number;
    finalizado! : boolean;

    ciudad_ret? : string;
    ciudad_dev? : string;

    constructor(){}
}

// id_peticion : int, sucursal_retiro : int, sucursal_devolucion : int
// fecha_retiro : datetime, fecha_devolucion : datetime, codigo_retiro : varchar
// auto_sucursal : int, usuario : int, finalizado : bit