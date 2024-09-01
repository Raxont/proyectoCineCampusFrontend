/** //* Esquema boleta
 * {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'identificacion_cliente',
      'id_lugar',
      'fecha_adquisicion',
      'estado',
      'id_asiento',
      'precio'
    ],
    properties: {
      identificacion_cliente: {
        bsonType: 'int',
        description: 'El dato debe ser un entero de 10 dígitos',
        minimum: 1000000000,
        maximum: 9999999999
      },
      id_lugar: {
        bsonType: 'objectId',
        description: 'Este dato tiene que ser ObjectID'
      },
      fecha_adquisicion: {
        bsonType: 'date',
        description: 'La fecha debe ser formato ISODate'
      },
      estado: {
        bsonType: 'string',
        'enum': [
          'fisico',
          'en_linea'
        ],
        description: 'Solo puede ser fisico o en_linea'
      },
      id_asiento: {
        bsonType: 'array',
        items: {
          bsonType: 'objectId',
          description: 'Este dato tiene que ser ObjectID'
        }
      },
      precio: {
        bsonType: [
          'int',
          'double'
        ],
        description: 'Este dato puede ser un entero o un número decimal'
      }
    }
  }
}
*/

/** //* Esquema cliente
 * {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'identificacion',
      'nombre',
      'nick',
      'email',
      'telefono',
      'estado'
    ],
    properties: {
      identificacion: {
        bsonType: 'int',
        description: 'El dato debe ser un entero de 10 dígitos',
        minimum: 1000000000,
        maximum: 9999999999
      },
      nombre: {
        bsonType: 'string',
        description: 'No se aceptan caracteres especiales en el nombre',
        pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$'
      },
      nick: {
        bsonType: 'string',
        description: 'Debe tener entre 3 y 15 caracteres',
        pattern: '^[A-Za-z0-9._]{3,15}$'
      },
      email: {
        bsonType: 'string',
        description: 'Debe ser una dirección de correo electrónico válida'
      },
      telefono: {
        bsonType: 'array',
        items: {
          bsonType: 'string',
          pattern: '^[1-9]\\d{9}$',
          description: 'El dato debe tener exactamente 10 números. Se permiten espacios opcionales'
        }
      },
      estado: {
        bsonType: 'string',
        'enum': [
          'administrador',
          'usuarioEstandar',
          'usuarioVip'
        ],
        description: 'Solo puede ser \'administrador\' , \'usuarioEstandar\' , \'usuarioVip\''
      }
    }
  }
}
*/

/** //* Esquema tarjeta
 * {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'numero',
      'identificacion_cliente',
      'fecha_expedicion',
      'estado'
    ],
    properties: {
      numero: {
        bsonType: 'int',
        description: 'El numero de documento solo puede tener 6 dígitos',
        minimum: 100000,
        maximum: 999999
      },
      identificacion_cliente: {
        bsonType: 'int',
        description: 'El dato debe ser un entero de 10 dígitos',
        minimum: 1000000000,
        maximum: 9999999999
      },
      fecha_expedicion: {
        bsonType: 'date',
        description: 'La fecha debe ser en formato ISODate'
      },
      estado: {
        bsonType: 'string',
        'enum': [
          'activo',
          'vencido'
        ],
        description: 'El estado debe ser \'activo\' o \'vencido\''
      }
    }
  }
}
*/

/** //* Esquema pelicula
 * {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'titulo',
      'genero',
      'duracion',
      'sinopsis',
      'img',
      'casting',
      'trailerId'
    ],
    properties: {
      titulo: {
        bsonType: 'string',
        pattern: '^[A-Za-z0-9\\s\\-\\\'\\"()]{1,100}$',
        description: 'El título no puede ser de más de 100 caracteres'
      },
      genero: {
        bsonType: 'array',
        items: {
          bsonType: 'string',
          pattern: '^[A-Za-z\\s\\-]{1,50}$',
          description: 'El género no puede ser de más de 50 caracteres'
        }
      },
      duracion: {
        bsonType: 'int',
        minimum: 1,
        maximum: 999,
        description: 'La duración no puede ser mayor a 999 ni menor a 1'
      },
      sinopsis: {
        bsonType: 'string',
        pattern: '^[\\s\\S]{1,400}$',
        description: 'La sinopsis no puede ser de más de 400 caracteres'
      },
      img: {
        bsonType: 'string',
        pattern: '^[\\s\\S]{1,400}$',
        description: 'Link de la imagen'
      },
      casting: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: [
            'img',
            'nombre',
            'personaje'
          ],
          properties: {
            img: {
              bsonType: 'string',
              pattern: '^[\\s\\S]{1,400}$',
              description: 'Link de la imagen del casting'
            },
            nombre: {
              bsonType: 'string',
              description: 'Nombre del actor o actriz'
            },
            personaje: {
              bsonType: 'string',
              description: 'Nombre del personaje interpretado'
            }
          }
        }
      },
      trailerId: {
        bsonType: 'string',
        pattern: '^[A-Za-z0-9_-]+(?:\\?.*)?$',
        description: 'Debe ser un ID de tráiler de YouTube válido'
      }
    }
  }
}

*/

/** //* Esquema lugar
 * {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'nombre',
      'precio',
      'fecha_inicio',
      'fecha_fin',
      'id_pelicula'
    ],
    properties: {
      nombre: {
        bsonType: 'string',
        pattern: '^Sala \\d{2}$',
        description: 'El nombre de la sala debe seguir el formato \'Sala XX\', donde XX son dos números'
      },
      precio: {
        bsonType: 'string',
        pattern: '^[0-9]+(\\.[0-9]{1,2})?$',
        description: 'El precio solo puede contener números y opcionalmente hasta dos decimales'
      },
      fecha_inicio: {
        bsonType: 'date',
        description: 'Solo el formato ISODate es admitido'
      },
      fecha_fin: {
        bsonType: 'date',
        description: 'Solo el formato ISODate es admitido'
      },
      id_pelicula: {
        bsonType: 'objectId',
        description: 'Solo el formato ObjectId es admitido'
      }
    }
  }
}
*/

/** //* Esquema asientos
 *{
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'tipo_fila',
      'codigo',
      'incremento',
      'id_lugar'
    ],
    properties: {
      tipo_fila: {
        bsonType: 'string',
        'enum': [
          'premier',
          'general'
        ],
        description: 'Ingrese si es \'premier\' o \'general\''
      },
      codigo: {
        bsonType: 'string',
        pattern: '^[A-Z]\\d{2}$',
        description: 'El código del asiento debe seguir el formato \'A01\', \'B23\', etc.'
      },
      incremento: {
        bsonType: 'int',
        'enum': [
          0,
          10
        ],
        description: 'Ingrese el número 0 o 10'
      },
      id_lugar: {
        bsonType: 'array',
        items: {
          bsonType: 'objectId',
          description: 'Este dato tiene que ser ObjectID'
        }
      }
    }
  }
}
*/