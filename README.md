

# Como usar mi repositorio

Tengo un modulo llamado `lugar.js` en el cual manejo el CRUD de mi colección `lugar`, teniendo asi 5 funciones:

| Nombre de la función | Que hace?                                                    |
| -------------------- | ------------------------------------------------------------ |
| `hasPermission`      | *Verifica permisos del usuario ingresado*                    |
| `getAllLugarByDay`   | *Obtiene todos los lugares por fecha.* La fecha la obtengo con la actual |
| `addLugar`           | *Agrega un nuevo lugar*                                      |
| `updateLugar`        | *Actualiza la información de un lugar*                       |
| `deleteLugar`        | *Elimina un lugar por su ID*                                 |



# Instalación librería validator.js

Se instala la librería `validator.js` para realizar una validación más robusta de los correos electrónicos ingresados en la base de datos, evitando así el uso de patrones de expresión regular para este propósito

## Creación del super usuario y administrador

Creación del super-usuario encargado de administrar el servidor donde esta alojado la base de datos.

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

## Creación del rol administrador

```javascript
db.createRole({
    role: "admindb",
    privileges: [
       	{
                resource: { db: "CineCampus", collection: "" },
                actions: [
                    "find", "insert", "update", "remove",
                    "createCollection", "createIndex", "dropCollection",
                    "listCollections", "listIndexes", "dropIndex"
                ]
        },
        {
            resource: { db: "CineCampus", collection: "system.users" },
            actions: ["find", "insert", "update", "remove"]
        },
        {
            resource: { db: "CineCampus", collection: "system.roles" },
            actions: ["find", "insert", "update", "remove"]
        },
    ],
    roles: []
})

```

## Valores para conectarse a la base de datos como administrador

```javascript
MONGO_USER="admin"
MONGO_PORT=57340
MONGO_PWD="admin"
MONGO_HOST="mongodb://"
MONGO_CLUSTER="roundhouse.proxy.rlwy.net"
MONGO_DB="CineCampus"
USER_PERMISSIONS="view,add,update,delete"
```

