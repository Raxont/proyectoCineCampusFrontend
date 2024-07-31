import { mainLugar, mainBoleta, mainAsientos, mainTarjetas, mainCliente } from "./js/modules/funciones.js";

    //! Descomente la funcion main que desea usar
    //* Debajo de cada funcion main tiene los valores que estaria mostrando por defeecto
    const actionLugar = "getByPelicula"; //* Acción por defecto el cual debe de ser modificando segun la necesidad. Usa 'getAllByDate', 'add', 'update' , 'delete' , 'getByPelicula'
    //mainLugar(actionLugar); // * Ejecuta la función principal con la acción definida
    /**
     *  //* Valor que muestra al filtrar por dia
     * @returns lugar por fecha: [
                {
                    fecha_inicio: 2024-08-01T10:00:00.000Z,
                    fecha_fin: 2024-08-01T12:00:00.000Z,
                    titulo: 'La gran aventura',
                    genero: [ 'Acción', 'Aventura' ],
                    duracion: 120,
                    sinopsis: 'En un mundo lleno de peligros, un héroe debe emprender una misión para salvar a su pueblo.'
                }
                ]
    */

    /**
     *  //* Valor que muestra al filtrar por pelicula
     * @returns lugar por pelicula: [
                {
                    fecha_inicio: 2023-07-01T10:00:00.000Z,
                    fecha_fin: 2023-07-01T12:00:00.000Z,
                    titulo: 'La gran aventura',
                    genero: [ 'Acción', 'Aventura' ],
                    duracion: 120,
                    sinopsis: 'En un mundo lleno de peligros, un héroe debe emprender una misión para salvar a su pueblo.'
                },
                {
                    fecha_inicio: 2024-08-01T10:00:00.000Z,
                    fecha_fin: 2024-08-01T12:00:00.000Z,
                    titulo: 'La gran aventura',
                    genero: [ 'Acción', 'Aventura' ],
                    duracion: 120,
                    sinopsis: 'En un mundo lleno de peligros, un héroe debe emprender una misión para salvar a su pueblo.'
                }
                ]
    */

    const actionBoleta = "getAsientos"; //* Acción por defecto el cual debe de ser modificando según la necesidad. Usa 'getAll', 'add', 'update', 'delete', 'getByCliente', 'getAsientos'
    //mainBoleta(actionBoleta); // * Ejecuta la función principal con la acción definida
    /**
     *  //* Valor que muestra las boletas por identificación de cliente
     * @returns Boletas por cliente con fecha de inicio: [
                  {
                    identificacion_cliente: 1234567890,
                    id_lugar: new ObjectId('66a579bb7b00907fab0aee94'),
                    fecha_adquisicion: 2024-07-29T21:07:55.646Z,
                    estado: 'en_linea',
                    id_asiento: [],
                    fechaHora_pelicula: 2024-08-01T10:00:00.000Z
                  }
                ]
    */

    /**
     *  //* Valor que muestra la disponibilidad de asientos en una sala
     * @returns Asientos disponibles: [
                  {
                    _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                    tipo_fila: 'premier',
                    codigo: 'A01',
                    incremento: 10
                  },
                  {
                    _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                    tipo_fila: 'premier',
                    codigo: 'A02',
                    incremento: 10
                  },
                  {
                    _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                    tipo_fila: 'premier',
                    codigo: 'A03',
                    incremento: 10
                  },
                  {
                    _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                    tipo_fila: 'general',
                    codigo: 'B01',
                    incremento: 0
                  },
                  {
                    _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                    tipo_fila: 'general',
                    codigo: 'B02',
                    incremento: 0
                  },
                  {
                    _id: new ObjectId('66a804abdf6d8860acf5baf4'),
                    tipo_fila: 'general',
                    codigo: 'B03',
                    incremento: 0
                  }
                ]
    */

    const actionAsientos = "returnReserva"; //* Acción por defecto el cual debe de ser modificando según la necesidad. Usa 'getReserva', 'returnReserva'.
    //mainAsientos(actionAsientos); // * Ejecuta la función principal con la acción definida
    /**
     *  //* Valor que muestra al realizar una reserva de un asiento
     * @returns Asiento actualizado en boleta: {
                  message: 'Asiento actualizado correctamente en la boleta.',
                  movimientos: {
                    asiento: 'idLugar 66a579bb7b00907fab0aee94 eliminado de idAsiento 66a6d3fa1c9570011db88fdb',
                    boleta: 'idAsiento 66a6d3fa1c9570011db88fdb agregado a la boleta del cliente 1234567890'    
                  }
                }
    */

    /**
     *  //* Valor que muestra al cancelar una reserva de un asiento
     * @returns Asiento actualizado en boleta: {
                  message: 'Asiento revertido correctamente en la boleta.',
                  movimientos: {
                    asiento: 'idLugar 66a579bb7b00907fab0aee94 agregado a idAsiento 66a6d3fa1c9570011db88fdb',
                    boleta: 'idAsiento 66a6d3fa1c9570011db88fdb eliminado de la boleta del cliente 1234567890'
                  }
                }
    */

    const actionTarjeta = "getDescuento"; //* Acción por defecto el cual debe de ser modificando según la necesidad. Usa 'getDescuento'
    //maintarjetas(actionTarjeta); // * Ejecuta la función principal con la acción definida
    /**
     *  //* Valor que muestra al realizar una reserva de un tarjeta
     * @returns tarjeta actualizado en boleta: 
                _id= "66a804abdf6d8860acf5baf4"
                identificacion_cliente=1234567890
                id_lugar="66a579bb7b00907fab0aee94"
                fecha_adquisicion =2024-07-29T21:07:55.646+00:00
                estado="en_linea"
                id_asiento=Array (empty)
                precio=10
    */


    const actionCliente = "showUser"; //* Acción por defecto, modifícala según la necesidad. Usa 'create' , 'showUser' , 'updateUser' , 'allRol'.
    //mainCliente(actionCliente); // * Ejecuta la función principal con la acción definida

    /**
     *  //* Valor que muestra al ver los usuarios por identificacion incluyendo el estado vip
     * //*  y al agregar un nuevo usuario
     * @returns Usuario de la base de datos:  [
                  {
                    identificacion: 1234567890,
                    nombre: 'Carlos Andres',
                    nick: 'CaAn',
                    email: 'carlos_andres@gmail.com',
                    telefono: [ '3139670075' ],
                    estado: 'cliente',
                    estado_tarjeta: 'vencido'
                  }
                ]
                Usuario de MongoDB {
                  _id: 'CineCampus.CaAn',
                  userId: new UUID('a354be52-74d8-4e5e-9f69-858ac199c77b'),
                  user: 'CaAn',
                  db: 'CineCampus',
                  roles: [ { role: 'cliente', db: 'CineCampus' } ],
                  mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
                }
    */

    /**
     *  //* Valor que muestra en la base de datos y mongoDB al actualizar el usuario
     * @returns cliente de la base de datos [ 
                  _id:66a9bc1f4897d3289107d935
                  identificacion:1234567890
                  nombre:"Carlos Andres"
                  nick:"CaAn"
                  email:"carlos_andres@gmail.com"
                  telefono: 0:"3139670075"
                  estado:"cliente"
                ]
                tarjeta de la base de datos [ 
                  _id:66a9588b5a6b264ba0ae9006
                  numero:123456
                  fecha_expedicion:2024-07-28T00:00:00.000+00:00
                  estado:"vencido"
                  identificacion_cliente:1234567890
                ]
    */

    /**
     *  //* Valor que muestra al ver los usuarios por rol
     * @returns Usuario de la base de datos por rol clienteVIP [
                  {
                    identificacion: 1234567890,
                    nombre: 'Carlos Andres',
                    nick: 'CaAn',
                    email: 'carlos_andres@gmail.com',
                    telefono: [ '3139670075' ],
                    estado: 'clienteVIP'
                  }
                ]
                Usuario de MongoDB por rol clienteVIP [
                  {
                    _id: 'CineCampus.vip',
                    userId: new UUID('aff59257-26f6-4c42-a661-3ca3eb51e422'),
                    user: 'vip',
                    db: 'CineCampus',
                    roles: [ [Object] ],
                    mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
                  }
                ]
    */
    