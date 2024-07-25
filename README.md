# Creación del super usuario

En este commit se documenta la creación del super-usuario encargado de administrar la base de datos.

Comando utilizado para su creación:

```javascript
db.createUser({
    user: "root",
    pwd:passwordPrompt(),
    roles:[{role:"root",db:"admin"}]
})
```



# Valores para conectarse a la base de datos

```javascript
MONGO_USER="root"
MONGO_PORT=27017
MONGO_PWD="DobAzusRmgfqAghnvzhVafpIdeOemnEW"
MONGO_HOST="mongodb.railway.internal"
MONGO_CLUSTER="mongodb://"
MONGO_DB="CineCampus"
USER_PERMISSIONS="view,add,update,delete"
```

