/** //* Esquema boleta
 * {
  "$jsonSchema": {
    "bsonType": "object", // ? El tipo de dato debe ser un objeto
    "required": [// ? Campos obligatorios en el objeto
    "identificación_cliente", 
    "id_lugar", 
    "fecha_adquisicion",
    "estado",
    "id_asiento"
    ], 
    "properties": { // ? Propiedades del objeto
      "identificación_cliente": {
        "bsonType": "int", // ? El dato debe ser un entero
        "description": "El dato debe ser un entero de 10 dígitos", // ? Descripción de la propiedad
        "minimum": 1000000000, // ? Mínimo valor permitido (10 dígitos)
        "maximum": 9999999999 // ? Máximo valor permitido (10 dígitos)
      },
      "id_lugar": {
        "bsonType": "objectId", // ? El dato debe ser de tipo ObjectId
        "description": "Este dato tiene que ser ObjectID" // ? Descripción de la propiedad
      },
      "fecha_adquisicion": {
        "bsonType": "date", // ? El dato debe ser una fecha en formato ISODate
        "description": "La fecha debe ser formato ISODate" // ? Descripción de la propiedad
      },
      "estado": {
        "bsonType": "string", // ? El dato debe ser una fecha en formato ISODate
        "enum": ["fisico", "en_linea"], // ? Valores permitidos
        "description": "Solo puede ser fisico o en_linea" // ? Descripción de la propiedad
      },
      "id_asiento": {
        "bsonType": "array", // ? El dato debe ser de tipo array
        "items": { // ? Cada elemento del arreglo
          "bsonType": "objectId", // ? El dato debe ser de tipo ObjectId
          "description": "Este dato tiene que ser ObjectID" // ? Descripción de la propiedad
        }
      }
    }
  }
}
*/

/** //* Esquema cliente
 * {
  "$jsonSchema": {
    "bsonType": "object", // ? El tipo de dato debe ser un objeto
    "required": [ // ? Campos obligatorios en el objeto
        "identificacion", 
        "nombre", 
        "nick", 
        "email", 
        "telefono", 
        "estado"
    ], 
    "properties": { // ? Propiedades del objeto
      "identificacion": {
        "bsonType": "int", // ? El dato debe ser un entero
        "description": "El dato debe ser un entero de 10 dígitos", // ? Descripción de la propiedad
        "minimum": 1000000000, // ? Mínimo valor permitido (10 dígitos)
        "maximum": 9999999999 // ? Máximo valor permitido (10 dígitos)
      },
      "nombre": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "description": "No se aceptan caracteres especiales en el nombre", // ? Descripción de la propiedad
        "pattern": "^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$" // ? Expresión regular para validar el nombre
      },
      "nick": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "description": "Debe tener entre 3 y 15 caracteres", // ? Descripción de la propiedad
        "pattern": "^[A-Za-z0-9._]{3,15}$" // ? Expresión regular para validar el nick
      },
      "email": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "description": "Debe ser una dirección de correo electrónico válida" // ? Descripción de la propiedad
      },
      "telefono": {
        "bsonType": "array", // ? El dato debe ser un arreglo
        "items": { // ? Cada elemento del arreglo
          "bsonType": "string", // ? Debe ser una cadena de caracteres
          "pattern": "^[1-9]\\d{9}$", // ? Expresión regular para validar el teléfono
          "description": "El dato debe tener exactamente 10 números. Se permiten espacios opcionales" // ? Descripción de la propiedad
        }
      },
      "estado": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "enum": ["admindb", "cliente","clienteVIP"], // ? Valores permitidos
        "description": "Solo puede ser 'admindb' , 'cliente' , 'clienteVIP'" // ? Descripción de la propiedad
      }
    }
  }
}
*/

/** //* Esquema tarjeta
 * {
  "$jsonSchema": {
    "bsonType": "object", // ? El tipo de dato debe ser un objeto
    "required": [ // ? Campos obligatorios en el objeto
        "numero", 
        "identificacion_cliente", 
        "fecha_expedicion", 
        "estado"
    ], 
    "properties": { // ? Propiedades del objeto
      "numero": {
        "bsonType": "int", // ? El dato debe ser un entero
        "description": "El numero de documento solo puede tener 6 dígitos", // ? Descripción de la propiedad
        "minimum": 100000, // ? Mínimo valor permitido (6 dígitos)
        "maximum": 999999 // ? Máximo valor permitido (6 dígitos)
      },
      "identificacion_cliente": {
        "bsonType": "int", // ? El dato debe ser un entero
        "description": "El dato debe ser un entero de 10 dígitos", // ? Descripción de la propiedad
        "minimum": 1000000000, // ? Mínimo valor permitido (10 dígitos)
        "maximum": 9999999999 // ? Máximo valor permitido (10 dígitos)
      },
      "fecha_expedicion": {
        "bsonType": "date", // ? El dato debe ser una fecha en formato ISODate
        "description": "La fecha debe ser en formato ISODate" // ? Descripción de la propiedad
      },
      "estado": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "enum": ["activo", "vencido"], // ? Valores permitidos
        "description": "El estado debe ser 'activo' o 'vencido'" // ? Descripción de la propiedad
      }
    }
  }
}
*/

/** //* Esquema pelicula
 * {
  "$jsonSchema": {
    "bsonType": "object", // ? El tipo de dato debe ser un objeto
    "required": [ // ? Campos obligatorios en el objeto
      "titulo",
      "genero",
      "duracion",
      "sinopsis"
    ],
    "properties": { // ? Propiedades del objeto
      "titulo": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "pattern": "^[A-Za-z0-9\\s\\-\\'\\\"()]{1,100}$", // ? Expresión regular para validar el título (1-100 caracteres)
        "description": "El título no puede ser de más de 100 caracteres" // ? Descripción de la propiedad
      },
      "genero": {
        "bsonType": "array", // ? El dato debe ser un arreglo
        "items": { // ? Elementos del arreglo
          "bsonType": "string", // ? Cada elemento del arreglo debe ser una cadena de caracteres
          "pattern": "^[A-Za-z\\s\\-]{1,50}$", // ? Expresión regular para validar el género (1-50 caracteres)
          "description": "El género no puede ser de más de 50 caracteres" // ? Descripción de la propiedad
        }
      },
      "duracion": {
        "bsonType": "int", // ? El dato debe ser un entero
        "minimum": 1, // ? Mínimo valor permitido
        "maximum": 999, // ? Máximo valor permitido
        "description": "La duración no puede ser mayor a 999 ni menor a 1" // ? Descripción de la propiedad
      },
      "sinopsis": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "pattern": "^[\\s\\S]{1,400}$", // ? Expresión regular para validar la sinopsis (1-400 caracteres)
        "description": "La sinopsis no puede ser de más de 400 caracteres" // ? Descripción de la propiedad
      }
    }
  }
}
*/

/** //* Esquema lugar
 * {
  "$jsonSchema": {
    "bsonType": "object", // ? El tipo de dato debe ser un objeto
    "required": [ // ? Campos obligatorios en el objeto
      "nombre",
      "precio",
      "fecha_inicio",
      "fecha_fin",
      "id_pelicula"
    ],
    "properties": { // ? Propiedades del objeto
      "nombre": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "pattern": "^Sala \\d{2}$", // ? Expresión regular para validar el nombre (debe seguir el formato 'Sala XX', donde XX son dos números)
        "description": "El nombre de la sala debe seguir el formato 'Sala XX', donde XX son dos números" // ? Descripción de la propiedad
      },
      "precio": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "pattern": "^[0-9]+(\\.[0-9]{1,2})?$", // ? Expresión regular para validar el precio (números y opcionalmente hasta dos decimales)
        "description": "El precio solo puede contener números y opcionalmente hasta dos decimales" // ? Descripción de la propiedad
      },
      "fecha_inicio": {
        "bsonType": "date", // ? El dato debe ser una fecha en formato ISODate
        "description": "Solo el formato ISODate es admitido" // ? Descripción de la propiedad
      },
      "fecha_fin": {
        "bsonType": "date", // ? El dato debe ser una fecha en formato ISODate
        "description": "Solo el formato ISODate es admitido" // ? Descripción de la propiedad
      },
      "id_pelicula": {
        "bsonType": "objectId", // ? El dato debe ser de tipo ObjectId
        "description": "Solo el formato ObjectId es admitido" // ? Descripción de la propiedad
      }
    }
  }
}
*/

/** //* Esquema asientos
 * {
  "$jsonSchema": {
    "bsonType": "object", // ? El tipo de dato debe ser un objeto
    "required": [ // ? Campos obligatorios en el objeto
      "tipo_fila",
      "codigo",
      "incremento",
      "id_lugar"
    ],
    "properties": { // ? Propiedades del objeto
      "tipo_fila": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "enum": ["premier", "general"], // ? Valores permitidos para el tipo de fila
        "description": "Ingrese si es 'premier' o 'general'" // ? Descripción de la propiedad
      },
      "codigo": {
        "bsonType": "string", // ? El dato debe ser una cadena de caracteres
        "pattern": "^[A-Z]\\d{2}$", // ? Expresión regular para validar el código del asiento (debe seguir el formato 'A01', 'B23', etc.)
        "description": "El código del asiento debe seguir el formato 'A01', 'B23', etc." // ? Descripción de la propiedad
      },
      "incremento": {
        "bsonType": "double", // ? El dato debe ser un número de tipo double
        "enum": [0, 0.10], // ? Valores permitidos para el incremento
        "description": "Ingrese el número 0 o 0.10" // ? Descripción de la propiedad
      },
      "id_lugar": {
        "bsonType": "array", // ? El dato debe ser de tipo array
        "items": { // ? Cada elemento del arreglo
          "bsonType": "objectId", // ? El dato debe ser de tipo ObjectId
          "description": "Este dato tiene que ser ObjectID" // ? Descripción de la propiedad
        }
      }
    }
  }
}
*/