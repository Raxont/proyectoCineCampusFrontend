# CineCampus

Proyecto de una simulación de un cine en Node.js usando Express.js, con base de datos MongoDB Local

Este proyecto cuenta con una selección para películas, compra de boletos, reserva de asientos, descuentos si son usuarios Vip, una creación de clientes para el manejo de la base de datos y un carrito de compras

Es necesario tener instalado mongoDB, mongo shell y las herramientas de mongoDB:

MongoDB:

```http
https://www.mongodb.com/try/download/community
```

Mongo Shell:

```http
https://www.mongodb.com/try/download/shell
```

Herramientas de mongoDB:

```http
https://www.mongodb.com/try/download/database-tools
```



## Instalación de mi proyecto

Clonar el repo:

```javascript
git clone https://github.com/Raxont/proyectoCineCampusFrontend.git
```

Dirigirse a la rama CommonJS:

```javascript
git checkout CommonJS
```

Instalar paquetes:

```javascript
npm i
```

Crear un .env para las variables de entorno

```javascript
cp .envTemplate .env
```

Crear la base de datos localmente con mongoDB y configurar el .env con los datos de su conexión

```javascript
MONGO_USER
MONGO_PORT
MONGO_PWD
MONGO_HOST
MONGO_CLUSTER
MONGO_DB
```

importar la base de datos del backup_CineCampus:

```javascript
npm run import
```

Crea la conexión con un servidor local con Express.js y configura el .env con los datos de su conexion

```javascript
HOST
PORT
```

Inicializar el proyecto

```javascript
npm run dev
```

## Arquitectura carpetas

## Public (Front End)

### 	css (Estilos de la web)

#### 		asiento.css

#### 		boleta.css

#### 		cliente.css

#### 		lugar.css

#### 		tarjeta.jss

### 	js (Scripts)

#### 		module

##### 			asiento.js

##### 			boleta.js

##### 			cliente.js

##### 			lugar.js

##### 			tarjeta.js

#### 		main.js

### 	storage (almacenamiento imagenes)

### 	views (Otras vistas html)

#### 		asiento.html

#### 		boleta.html

#### 		cliente.html

#### 		lugar.html

#### 		sincliente.html

#### 		tarjeta.html

### 	index.html

## Server (Back End)

### 	controllers (Maneja la lógica de la aplicación)

#### 		asientoController.js

#### 		boletaController.js

#### 		clienteController.js

#### 		lugarController.js

#### 		peliculaController.js

#### 		tarjetaController.js

### 	dto (Template de mensajes)

#### 		asientoDto.js

#### 		boletaDto.js

#### 		clienteDto.js

#### 		lugarDto.js

#### 		peliculaDto.js

#### 		tarjetaDto.js

### 	helpers (Backup de la base de datos y esquemas de validación)

#### 		backup_CineCampus

##### 			asientos.json

##### 			boleta.json

##### 			cliente.json

##### 			import.js (Script para importar el backup a mongoDB localmente)

##### 			lugar.json

##### 			pelicula.json

##### 			tarjeta.json

#### 		esquemas.js

### 	infrastructure/database (Conexión con mi base de datos)

#### 		conexion.js

### 	models (Interactúa con la base de datos y realiza operaciones relacionadas con los datos)

#### 		asientoModel.js

#### 		boletaModel.js

#### 		clienteModel.js

#### 		lugarModel.js

#### 		peliculaModel.js

#### 		tarjetaModel.js

### 	routes (Define y maneja las rutas HTTP específicas que el servidor puede aceptar)

#### 		asientoRoutes.js

#### 		boletaRoutes.js

#### 		clienteRoutes.js

#### 		lugarRoutes.js

#### 		peliculaRoutes.js

#### 		tarjetaRoutes.js

#### 	server.js (Punto de entrada para el backend)

### .env (Manejo la variables de entorno)

### .envTemplate (Template de las variables de entorno)



# 1) Selección de Funciones

Esta es la sección principal de mi página web. Para acceder a ella, utiliza la siguiente URI:

```http
http://localhost:3000/lugar
```



# Datos a quemar 

### Filtrar los lugares por fecha deseada

##### PETICION:  GET

##### URI: http://localhost:3000/lugar/lugaresPorFecha?fechaInicioFiltro=2024-08-01&fechaFinFiltro=2024-11-01

##### HEADER: Content-Type : application/json

#### Query:

```json
fechaInicioFiltro = 2024-08-01
fechaFinFiltro = 2024-11-01
```



# 2) Información de una película

Para acceder a ella, utiliza la siguiente URI:

```http
http://localhost:3000/cliente?peliculaId=66c8e3983b9fd081fe7cc8e3
```



# Datos a quemar 

### Mostar la información completa de una película

##### PETICION:  GET

##### URI: http://localhost:3000/lugar/lugaresPorPelicula?idPelicula=66c8e3983b9fd081fe7cc8e3&fechaInicioFiltro=2024-08-01T10:00:00Z

##### HEADER: Content-Type : application/json

#### Query:

```json
idPelicula = 66c8e3983b9fd081fe7cc8e3
fechaInicioFiltro = 2024-08-01T10:00:00Z
```



# 3) Asignación de Asientos

Para acceder a ella, utiliza la siguiente URI:

```http
http://localhost:3000/asiento/verAsiento?idPelicula=66c8e3983b9fd081fe7cc8e3&fechaInicioFiltro=2024-08-01T00:00:00Z
```



# Datos a quemar 

### Reservar un asiento

##### PETICION:  POST

##### URI: http://localhost:3000/asiento/getReserva

##### HEADER: Content-Type : application/json

#### BODY:

```json
{
    "idAsiento": ["66a6d3fa1c9570011db88fdc"],
    "idLugar": "66a579bb7b00907fab0aee94",
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
    "idLugar": "66a579bb7b00907fab0aee94",
    "identificacionCliente": 1234567890
}
```



# 4) Descuentos y Tarjetas VIP

Para acceder a ella, utiliza la siguiente URI:

```http
http://localhost:3000/tarjeta/verBoleta?identificacionCliente=1234567890
```



# Datos a quemar 

### Obtener el descuento si tiene una tarjeta

##### PETICION:  POST

##### URI: http://localhost:3000/tarjeta/getDescuento

##### HEADER: Content-Type : application/json

#### BODY:

```json
{
  "idboleta":"66d084bff8f6456b810691c6", 
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



# 5) Compra de Boletos

Para acceder a ella, utiliza la siguiente URI:

```http
http://localhost:3000/boleta/verBoleta?identificacionCliente=1234567890
```



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
  "fecha_adquisicion": "2024-08-29T12:00:00Z",
  "estado": "fisico",
  "id_asiento": [],
  "precio":30
}
```

### Actualizar una boleta

##### PETICION:  PUT

##### URI: http://localhost:3000/boleta/actualizarBoleta/66d0a0462bc3287eb528ff52

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



# 6) Roles Definidos

Para utilizar esta sección, puede realizar las peticiones mediante herramientas como Thunder Client, Insomnia u otras similares.



# Datos a quemar 

### Crear un cliente

##### PETICION:  POST

##### URI: http://localhost:3000/cliente/crear

##### HEADER: Content-Type : application/json

#### BODY:

```json
{
  "identificacion": 1234567899,
  "nombre": "Juan Vip",
  "nick": "juanvip",
  "email": "juan.perez@example.com",
  "telefono": ["1234567890"],
  "estado": "usuarioVip"
}
```

### Buscar un cliente por la identificacion

##### PETICION:  GET

##### URI: http://localhost:3000/cliente/info/1234567890

##### HEADER: Content-Type : application/json

### Actualizar un cliente

##### PETICION:  PUT

##### URI: http://localhost:3000/cliente/actualizar

##### HEADER: Content-Type : application/json

#### BODY:

```json
{
  "identificacion": 1234567890,
  "estado": "usuarioEstandar",
  "nick": "user",
  "email": "carlos_andres@gmail.co"
}
```

### Obtener los clientes por rol

##### PETICION:  GET

##### URI: http://localhost:3000/cliente/rol/usuarioVip

##### HEADER: Content-Type : application/json



# - Instalación librería validator.js

Se instala la librería `validator.js` para realizar una validación más robusta de los correos electrónicos ingresados en la base de datos, evitando así el uso de patrones de expresión regular para este propósito

# - Instalación paquete dotenv

Se instala el paquete `dotenv` para cargar mis archivos a mi script con el cual estoy importando el backup de mi base de datos a mi base de datos local

# - Creación del super usuario

Creación del super-usuario encargado de administrar el servidor donde esta alojado la base de datos de CineCampus.

```javascript
db.createUser({
    user: "root",
    pwd:passwordPrompt(),
    roles:[{role:"root",db:"admin"}]
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

# - Valores para conectarse a la base de datos como super administrador `.env`

```javascript
MONGO_USER="root"
MONGO_PORT=27017
MONGO_PWD="Clave creada para el root"
MONGO_HOST="mongodb://"
MONGO_CLUSTER="localhost"
MONGO_DB="admin"

HOST="localhost"
PORT=3000
STATIC="public"
```

