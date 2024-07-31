# Selección de películas

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



# Compra de Boletos

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

# Asignación de Asientos

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

Tengo un módulo llamado `asientos.js`, en el cual manejo el CRUD de mi colección `asientos`, estas son las funciones que usa:

| Nombre de la función    | Que hace?                                                    |
| ----------------------- | ------------------------------------------------------------ |
| `hasPermission`         | *Verifica permisos del usuario ingresado*                    |
| `revertAsientoInBoleta` | *Permite la cancelación de una reserva de asiento ya realizada* |
| `updateAsientoInBoleta` | *Permite la selección y reserva de asientos para una proyección específica* |

# Descuentos y Tarjetas VIP

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

Tengo un módulo llamado `tarjeta.js`, en el cual manejo el CRUD de mi colección `tarjeta`, estas son las funciones que usa:

| Nombre de la función | Que hace?                                                    |
| -------------------- | ------------------------------------------------------------ |
| `hasPermission`      | *Verifica permisos del usuario ingresado*                    |
| `priceDiscount`      | *Permite la verificación de la validez de una tarjeta VIP y aplica el descuento a su compra* |

# Roles Definidos

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

Tengo un módulo llamado `cliente.js`, en el cual manejo el CRUD de mi colección `cliente`, estas son las funciones que usa:

| Nombre de la función | Que hace?                                                    |
| -------------------- | ------------------------------------------------------------ |
| `hasPermission`      | *Verifica permisos del usuario ingresado*                    |
| `whoUser`            | *Verifica cuál es el usuario*                                |
| `createUser`         | *Crea el usuario en MongoDB y lo guarda en la colección 'cliente'* |
| `showInfoUser`       | *Busca el ususario por numero de identificacion*             |
| `UpdateInfoUser`     | *Actualiza el usuario por numero de identificacion*          |
| `AllUsersRol`        | *Consulta todos los usuarios del sistema, con la posibilidad de filtrar por rol* |

# Instalación librería validator.js

Se instala la librería `validator.js` para realizar una validación más robusta de los correos electrónicos ingresados en la base de datos, evitando así el uso de patrones de expresión regular para este propósito

# Creación del super usuario, administrador, usuario y usuario vip

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
    roles:[{role:"admindb",db:"CineCampus"}]
})
```

Creación del usuario del CineCampus.

```javascript
db.createUser({
    user: "user",
    pwd:"user",
    roles:[{role:"cliente",db:"CineCampus"}]
})
```

Creación del usuario vip del CineCampus.

```javascript
db.createUser({
    user: "vip",
    pwd:"vip",
    roles:[{role:"clienteVIP",db:"CineCampus"}]
})
```

# Creación del rol administrador

```javascript
db.createRole({
    role: "admindb",
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
            { role: "userAdmin", db: "CineCampus" }]
})
```

# Creación del rol usuario estándar

```javascript
db.createRole( {
  role:"cliente",
  privileges: [
    {
      resource: { db: "CineCampus", collection: "pelicula" },
      actions: ["find"]
    },
    {
      resource: { db: "CineCampus", collection: "boleta" },
      actions: ["find", "insert"]
    },
    {
      resource: { db: "CineCampus", collection: "asientos" },
      actions: ["find"]
    },
    {
      resource: { db: "CineCampus", collection: "cliente" },
      actions: ["find", "update"]
    },
    {
      resource: { db: "CineCampus", collection: "lugar" },
      actions: ["find"]
    }
  ]
});
```

# Creación del usuario vip

```javascript
db.createRole({
  role: "clienteVIP",
  privileges: [
    {
      resource: { db: "CineCampus", collection: "tarjeta" },
      actions: ["find", "update"]
    }
  ],
  roles: ["cliente"]
})
```

# Valores para conectarse a la base de datos como administrador o como usuario en el archivo `.env`

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