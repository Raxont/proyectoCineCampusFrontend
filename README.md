# 1) Selección de películas

Si desea usar esta sección puede dirigirse al archivo `main.js`. Luego, baje a la sección donde llamo a la función `mainLugar()`. En esa parte, defino una constante llamada `actionLugar`, cuyo valor varía dependiendo de lo que desee hacer con la base de datos.

Estos son los datos que permite tomar la constante `actionLugar` :

- getAllByDate (Llama la funcion **getAllLugarWithPeliculaByDay**)
- add (Llama la funcion **addLugar**)
- update (Llama la funcion **updateLugar**)
- delete (Llama la funcion **deleteLugar**)
- getByPelicula (Llama la funcion **getLugaresByPelicula**)

# Lógica de mi código

Tengo un modulo llamado `funciones.js`, donde manejo la lógica principal de mi proyecto utilizando los módulos creados específicamente para este propósito. Cuento con estas funciones:

| Nombre de la función | Que hace?                                                    |
| -------------------- | ------------------------------------------------------------ |
| `mainLugar`          | *Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'* |
| `agregarlugar`       | *Función para agregar un lugar*                              |
| `actualizarlugar`    | *Función para actualizar un lugar*                           |
| `eliminarlugar`      | *Función para eliminar un lugar*                             |

Dentro de la función `mainLugar`, manejo varias opciones según lo requiera el usuario:

| Nombre de la opción | Que hace?                                                    |
| ------------------- | ------------------------------------------------------------ |
| `getAllByDate`      | *Permite la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección* |
| `add`               | *Agrega un nuevo lugar*                                      |
| `update`            | *Actualiza la información de un lugar*                       |
| `delete`            | *Elimina un lugar*                                           |
| `getByPelicula`     | *Permite la consulta de información detallada sobre una película específica, incluyendo sinopsis.* |

Tengo un módulo llamado `lugar.js`, en el cual manejo el CRUD de mi colección `lugar`, estas son las funciones que usa:

| Nombre de la función           | Que hace?                                                    |
| ------------------------------ | ------------------------------------------------------------ |
| `hasPermission`                | *Verifica permisos del usuario ingresado*                    |
| `getAllLugarWithPeliculaByDay` | *Obtiene todos los lugares por fecha y une con la información de las películas.* PD: La fecha la obtengo con la actual |
| `addLugar`                     | *Agrega un nuevo lugar*                                      |
| `updateLugar`                  | *Actualiza la información de un lugar*                       |
| `deleteLugar`                  | *Elimina un lugar por su ID*                                 |
| `getLugaresByPelicula`         | *Filtra lugares por una película específica*                 |

# Datos a quemar 

### Filtrar los lugares por fecha deseada

##### PETICION:  GET

##### URI: http://localhost:3000/lugar/lugaresPorFecha?fechaInicioFiltro=2024-08-21

##### HEADER: Content-Type : application/json

#### Query:

```json
fechaInicioFiltro = 2024-08-21
```

### Mostar la informacion completa de una pelicula

##### PETICION:  GET

##### URI: http://localhost:3000/lugar/lugaresPorPelicula?idPelicula=66a57941a0881522cdaabb9d

##### HEADER: Content-Type : application/json

#### Query:

```json
idPelicula = 66a57941a0881522cdaabb9d
```



# 2) Compra de Boletos

Si desea usar esta sección puede dirigirse al archivo `main.js`. Luego, baje a la sección donde llamo a la función `mainBoleta()`. En esa parte, defino una constante llamada `actionBoleta`, cuyo valor varía dependiendo de lo que desee hacer con la base de datos. 

Estos son los datos que permite tomar la constante `actionBoleta` :

- getAll (Llama la funcion **getAllboleta**)
- add (Llama la funcion **agregarBoleta**)
- update (Llama la funcion **actualizarBoleta**)
- delete (Llama la funcion **eliminarBoleta**)
- getByCliente (Llama la funcion **getBoletasWithFecha_Inicio**)
- getAsientos (Llama la funcion **getAsientosAvailable**)

# Lógica de mi código

Tengo un modulo llamado `funciones.js`, donde manejo la lógica principal de mi proyecto utilizando los módulos creados específicamente para este propósito. Cuento con estas funciones:

| Nombre de la función | Que hace?                                                    |
| -------------------- | ------------------------------------------------------------ |
| `mainBoleta`         | *Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'* |
| `agregarBoleta`      | *Función para agregar una boleta*                            |
| `actualizarBoleta`   | *Función para actualizar una boleta*                         |
| `eliminarBoleta`     | *Función para eliminar una boleta*                           |

Dentro de la función `mainBoleta`, manejo varias opciones según lo requiera el usuario:

| Nombre de la opción | Que hace?                                                    |
| ------------------- | ------------------------------------------------------------ |
| `getAll`            | *Obtiene todas las boletas*                                  |
| `agregarBoleta`     | *Agrega una nueva boleta*                                    |
| `update`            | *Actualiza la información de una boleta*                     |
| `delete`            | *Elimina una boleta*                                         |
| `getByCliente`      | *Obtiene boletas por identificación de cliente y trae la fecha de inicio de cada lugar* |
| `getAsientos`       | *Obtiene los asientos disponibles*                           |

Tengo un módulo llamado `boleta.js`, en el cual manejo el CRUD de mi colección `boleta`, estas son las funciones que usa:

| Nombre de la función         | Que hace?                                                    |
| ---------------------------- | ------------------------------------------------------------ |
| `hasPermission`              | *Verifica permisos del usuario ingresado*                    |
| `getAllboleta`               | *Obtiene todas las boletas*                                  |
| `getboletaById`              | *Obtiene una boleta por ID*                                  |
| `getBoletasWithFecha_Inicio` | *Obtiene boletas por identificación de cliente y trae la fecha de inicio de cada boleta* |
| `getAsientosAvailable`       | *Permite la consulta de la disponibilidad de asientos en una sala para una proyección específica* |
| `addLugar`                   | *Agrega una nueva boleta*                                    |
| `updateLugar`                | *Actualiza la información de una boleta*                     |
| `deleteLugar`                | *Elimina la boleta por su ID*                                |

# Datos a quemar 

### Obtener todas las boletas

##### PETICION:  GET

##### URI: http://localhost:3000/boleta/getAllBoletas

##### HEADER: Content-Type : application/json

### Obtener las boletas por cliente

##### PETICION:  GET

##### URI: http://localhost:3000/boleta/boletasPorCliente?identificacionCliente=1234567890

##### HEADER: Content-Type : application/json

#### Query:

```json
identificacionCliente = 1234567890
```

### Obtener los asientos disponibles

##### PETICION:  GET

##### URI: http://localhost:3000/boleta/asientosDisponibles?idLugar=66a52b6c89b4ae4007773f2c

##### HEADER: Content-Type : application/json

#### Query:

```json
idLugar = 66a52b6c89b4ae4007773f2c
```

### Agregar una nueva boleta

##### PETICION:  POST

##### URI: http://localhost:3000/boleta/agregarBoleta

##### HEADER: Content-Type : application/json

#### BODY:

```json
{
  "identificacion_cliente": 1234512345,
  "id_lugar":"66a579bb7b00907fab0aee94",
  "fecha_adquisicion": "2024-08-19T12:00:00Z",
  "estado": "fisico",
  "id_asiento": []
}
```

### Actualizar una boleta

##### PETICION:  PUT

##### URI: http://localhost:3000/boleta/actualizarBoleta/66c3955f80bb8b9f717d8746

##### HEADER: Content-Type : application/json

#### BODY:

```json
{
    "estado": "en_linea"
}
```

### Eliminar una boleta

##### PETICION:  DELETE

##### URI: http://localhost:3000/boleta/eliminarBoleta?idBoleta=66c3955f80bb8b9f717d8746

##### HEADER: Content-Type : application/json

#### Query:

```json
idBoleta = 66c3955f80bb8b9f717d8746
```



# 3) Asignación de Asientos

Si desea usar esta sección puede dirigirse al archivo `main.js`. Luego, baje a la sección donde llamo a la función `mainAsientos()`. En esa parte, defino una constante llamada `actionAsientos`, cuyo valor varía dependiendo de lo que desee hacer con la base de datos. 

Estos son los datos que permite tomar la constante `actionAsientos` :

- getReserva (Llama la funcion **updateAsientoInBoleta**)
- returnReserva (Llama la funcion **revertAsientoInBoleta**)

# Lógica de mi código

Tengo un modulo llamado `funciones.js`, donde manejo la lógica principal de mi proyecto utilizando los módulos creados específicamente para este propósito. Cuento estas funciones:

| Nombre de la función | Que hace?                                                    |
| -------------------- | ------------------------------------------------------------ |
| `mainAsientos`       | *Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'* |

Dentro de la función `mainAsientos`, manejo varias opciones según lo requiera el usuario:

| Nombre de la opción | Que hace?                                     |
| ------------------- | --------------------------------------------- |
| `getReserva`        | *Permite la selección y reserva de asientos*  |
| `returnReserva`     | *Cancela una reserva de asiento ya realizada* |

Tengo un módulo llamado `asientos.js`, en el cual manejo mi colección `asientos`, estas son las funciones que usa:

| Nombre de la función    | Que hace?                                                    |
| ----------------------- | ------------------------------------------------------------ |
| `hasPermission`         | *Verifica permisos del usuario ingresado*                    |
| `revertAsientoInBoleta` | *Permite la cancelación de una reserva de asiento ya realizada* |
| `updateAsientoInBoleta` | *Permite la selección y reserva de asientos para una proyección específica* |

# Datos a quemar 

### Reservar un asiento

##### PETICION:  PUT

##### URI: http://localhost:3000/asiento/getReserva

##### HEADER: Content-Type : application/json

#### BODY:

```json
{
    "idAsiento": "66a6d3fa1c9570011db88fdc",
    "idLugar": "66a52b6c89b4ae4007773f2c",
    "identificacionCliente": 1234567890
}
```

### Cancelar la reserva de un asiento

##### PETICION:  PUT

##### URI: http://localhost:3000/asiento/returnReserva

##### HEADER: Content-Type : application/json

#### BODY:

```json
{
    "idAsiento": "66a6d3fa1c9570011db88fdc",
    "idLugar": "66a52b6c89b4ae4007773f2c",
    "identificacionCliente": 1234567890
}
```



# 4) Descuentos y Tarjetas VIP

Si desea usar esta sección puede dirigirse al archivo `main.js`. Luego, baje a la sección donde llamo a la función `maintarjetas()`. En esa parte, defino una constante llamada `actionTarjeta`, cuyo valor varía dependiendo de lo que desee hacer con la base de datos. 

Estos son los datos que permite tomar la constante `actionTarjeta` :

- getDescuento (Llama la funcion **priceDiscount**)

# Lógica de mi código

Tengo un modulo llamado `funciones.js`, donde manejo la lógica principal de mi proyecto utilizando los módulos creados específicamente para este propósito. Cuento estas funciones:

| Nombre de la función | Que hace?                                                    |
| -------------------- | ------------------------------------------------------------ |
| `maintarjetas`       | *Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'* |

Dentro de la función `maintarjetas`, manejo varias opciones según lo requiera el usuario:

| Nombre de la opción | Que hace?                                           |
| ------------------- | --------------------------------------------------- |
| `getDescuento`      | *Permite ver el precio con el descuento si aplica.* |

Tengo un módulo llamado `tarjeta.js`, en el cual manejo mi colección `tarjeta`, estas son las funciones que usa:

| Nombre de la función | Que hace?                                                    |
| -------------------- | ------------------------------------------------------------ |
| `hasPermission`      | *Verifica permisos del usuario ingresado*                    |
| `priceDiscount`      | *Permite la verificación de la validez de una tarjeta VIP y aplica el descuento a su compra* |

### Obtener el descuento si tiene una tarjeta

##### PETICION:  POST

##### URI: http://localhost:3000/tarjeta/getDescuento

##### HEADER: Content-Type : application/json

#### BODY:

```json
{
  "idLugar":"66a52b6c89b4ae4007773f2c", 
  "identificacionCliente": 1234567890
}
```

### Agregar una nueva tarjeta VIP

##### PETICION:  POST

##### URI: http://localhost:3000/tarjeta/createTarjeta

##### HEADER: Content-Type : application/json

#### BODY:

```json
{
  "identificacionCliente":1234512345, 
  "numero": 654321,
  "fecha_expedicion": "2024-08-19T00:00:00.000Z",
  "estado": "activo"
}
```

### 

# 5) Roles Definidos

Si desea usar esta sección puede dirigirse al archivo `main.js`. Luego, baje a la sección donde llamo a la función `mainCliente()`. En esa parte, defino una constante llamada `actionCliente`, cuyo valor varía dependiendo de lo que desee hacer con la base de datos. 

Estos son los datos que permite tomar la constante `actionCliente` :

- create (Llama la funcion **createUser**)
- showUser (Llama la funcion **showInfoUser**)
- updateUser (Llama la funcion **UpdateInfoUser**)
- allRol (Llama la funcion **AllUsersRol**)

# Lógica de mi código

Tengo un modulo llamado `funciones.js`, donde manejo la lógica principal de mi proyecto utilizando los módulos creados específicamente para este propósito. Cuento estas funciones:

| Nombre de la función | Que hace?                                                    |
| -------------------- | ------------------------------------------------------------ |
| `mainCliente`        | *Función principal que ejecuta diferentes acciones basadas en el parámetro 'action'* |

Dentro de la función `mainCliente`, manejo varias opciones según lo requiera el usuario:

| Nombre de la opción | Que hace?                                                    |
| ------------------- | ------------------------------------------------------------ |
| `create `           | *Crea un nuevo usuario.*                                     |
| `showUser `         | *Muestra un usuario especifico junto a su tarjeta si aplica.* |
| `updateUser `       | *Actualiza un nuevo usuario*                                 |
| `allRol `           | *Muestra todos los usuarios por rol*                         |

Tengo un módulo llamado `cliente.js`, en el cual manejo mi colección `cliente`, estas son las funciones que usa:

| Nombre de la función | Que hace?                                                    |
| -------------------- | ------------------------------------------------------------ |
| `hasPermission`      | *Verifica permisos del usuario ingresado*                    |
| `whoUser`            | *Verifica cuál es el usuario*                                |
| `createUser`         | *Crea el usuario en MongoDB y lo guarda en la colección 'cliente'* |
| `showInfoUser`       | *Busca el ususario por numero de identificacion*             |
| `UpdateInfoUser`     | *Actualiza el usuario por numero de identificacion*          |
| `AllUsersRol`        | *Consulta todos los usuarios del sistema, con la posibilidad de filtrar por rol* |



# - Instalación librería validator.js

Se instala la librería `validator.js` para realizar una validación más robusta de los correos electrónicos ingresados en la base de datos, evitando así el uso de patrones de expresión regular para este propósito



# - Creación del super usuario, administrador, usuario y usuario vip

Creación del super-usuario encargado de administrar el servidor donde esta alojado la base de datos de CineCampus.

```javascript
db.createUser({
    user: "root",
    pwd:passwordPrompt(),
    roles:[{role:"root",db:"admin"}]
})
```

Creación del administrador encargado de administrar la base de datos de CineCampus.

```javascript
db.createUser({
    user: "admin",
    pwd:"admin",
    roles:[{role:"administrador",db:"CineCampus"},
          { role: "userAdminAnyDatabase", db: "admin" },
          { role: "dbAdminAnyDatabase", db: "admin" }]
})
```

Creación del usuario del CineCampus.

```javascript
db.createUser({
    user: "user",
    pwd:"1234567890",
    roles:[{role:"usuarioEstandar",db:"CineCampus"}]
})
```

Creación del usuario vip del CineCampus.

```javascript
db.createUser({
    user: "vip",
    pwd:"vip",
    roles:[{role:"usuarioVip",db:"CineCampus"}]
})
```

# - Creación del rol administrador

```javascript
db.createRole({
    role: "administrador",
    privileges: [
        {
            resource: { db: "CineCampus", collection: "" },
            actions: [
                "find", "insert", "update", "remove",
                "createCollection", "createIndex", "dropCollection",
                "listCollections", "listIndexes", "dropIndex",
                "createUser", "dropUser", "grantRole", "revokeRole", "updateUser"
            ]
        },
        {
            resource: { db: "CineCampus", collection: "system.users" },
            actions: ["find", "insert", "update", "remove", "viewUser"]
        },
        {
            resource: { db: "CineCampus", collection: "system.roles" },
            actions: ["find", "insert", "update", "remove", "viewRole"]
        }
    ],
    roles:[ { role: "dbAdmin", db: "CineCampus" },
			{ role: "readWrite", db: "CineCampus" },
            { role: "userAdmin", db: "CineCampus" },
            { role: "dbOwner", db: "CineCampus" }
          ]
})
```

# - Creación del rol usuario estándar

```javascript
db.createRole( {
  role:"usuarioEstandar",
  privileges: [
    {
      resource: { db: "CineCampus", collection: "pelicula" },
      actions: ["find"]
    },
    {
      resource: { db: "CineCampus", collection: "boleta" },
      actions: ["find", "insert", "update", "remove",]
    },
    {
      resource: { db: "CineCampus", collection: "asientos" },
      actions: ["find", "insert", "update", "remove"]
    },
    {
      resource: { db: "CineCampus", collection: "cliente" },
      actions: ["find", "update"]
    },
    {
      resource: { db: "CineCampus", collection: "lugar" },
      actions: ["find"]
    }
  ],
    roles: []
});
```

# - Creación del usuario vip

```javascript
db.createRole({
  role: "usuarioVip",
  privileges: [
    {
      resource: { db: "CineCampus", collection: "tarjeta" },
      actions: ["find", "update"]
    }
  ],
  roles: ["usuarioEstandar"]
})
```

# - Valores para conectarse a la base de datos como administrador o como usuario en el archivo `.env`

```javascript
MONGO_USER="admin"
MONGO_PORT=57340
MONGO_PWD="admin"
MONGO_HOST="mongodb://"
MONGO_CLUSTER="roundhouse.proxy.rlwy.net"
MONGO_DB="CineCampus"
USER_PERMISSIONS="view,add,update,delete"
```

```javascript
MONGO_USER="user" (Puede usar al usuario "vip")
MONGO_PORT=57340
MONGO_PWD="user" (Clave del vip "vip")
MONGO_HOST="mongodb://"
MONGO_CLUSTER="roundhouse.proxy.rlwy.net"
MONGO_DB="CineCampus"
USER_PERMISSIONS="view,add"
```

Los dos tipos de usuarios diferentes al administrador solo podrían ver y crear en las diferentes colecciones