export class Auto_Sucursal{
    id_auto_sucursal! : number;
    id_auto! : number;
    id_sucursal_actual! : number;

    nombre? : string;
    marca? : string;
    costo? : number;
    imagen? : Blob;

    cantidad? : number;
    reservado? : boolean;

    constructor(){
        this.cantidad = 0;
    }
}

    
// id_auto_sucursal : int, id_auto : int, id_sucursal_actual : int
// rentado : bit