# PORTAFOLIO - TALENTO DIGITAL

Esta aplicación web, crea rutas a distintos puntos de interés en la ciudad, y muesta la ruta más corta a pie.
Por ahora y con las instrucciones disponibles en la API: https://github.com/Eban451/PORTAFOLIO-TALENTO-DIGITAL-API.git
se pueden ver puntos en la ciudad de Valparaíso, pero se pueden agregar más en la ciudad donde se carga su mapa
que tiene un boton de usar la localización mediante GPS para ser el punto de partida del cálculo de rutas.


Esteban Zuñiga (Eban451)


# Repositorio
[https://github.com/Eban451/PORTAFOLIO-TALENTO-DIGITAL-API.git]


## Para que el proyecto funcione correctamente es necesario la instalación node.js, y mediante terminal con el comando "npm i" se deben instalar las siguientes dependencias:
- express
- pg
- cors
- node
- nodemon
- bodyParser
- passport
- cookieParser
- express-session
- express-flash
- bcrypt
- method-override
- multer
- dotenev
- passport-local

Igualmente se deben primero desplegar la API, disponible en: https://github.com/Eban451/PORTAFOLIO-TALENTO-DIGITAL-API.git
Y luego, como se menciona en la API, crea un usuario master, que es el que puede cambiar la categoría de otros usuarios,
ya que mediante el registro siempre serán solo usuarios básicos que no podrán generar nuevas ubicaciones, cosa que solo
puede hacer el Admin y los colaboradores que el administrador designe.

Recordar, que se debe crear al usuario de esta forma luego de poner en marcha la Base de datos según las instrucciones de la API:

```bash
INSERT INTO users(name,email,categoria,password) VALUES('Master','master123@gmail.com',1,'$2b$10$LTx/J3o9heeA1BZzpYd5U.pjcWiyv1TU0TRQWh3IOk8RJXXiR7PTa');
```

Se deben ingresar las variables de entor propias en el .evn
Para conectarse a la Base de datos y poder configurar el archivo db.Config.js

```bash
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DATABASE=

SESSION_SECRET=
```

Esta aplicación se abre por defecto en el puerto 3000

```bash
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
```
Clonar proyecto
```bash
  git clone https://github.com/Eban451/PORTAFOLIO-TALENTO-DIGITAL-API.git
```
El proyecto se puede correr de esta manera igualmente
```bash
  npm run dev 
```
Adjunto algunas imagenes de los mantenedores:

Mantenedor Usuarios

![App Screenshot](https://github.com/Eban451/Proyecto-Personal-Eban/blob/master/screenshots/Mantenedor1.png?raw=true)

Mantenedor puntos

![App Screenshot](https://github.com/Eban451/Proyecto-Personal-Eban/blob/master/screenshots/Mantenedor2.png?raw=true)

Mantenedor puntos ingreso datos

![App Screenshot](https://github.com/Eban451/Proyecto-Personal-Eban/blob/master/screenshots/IDM2.JPG?raw=true)

Y dejo un imagen del mapa en funcionamiento:

![App Screenshot](https://github.com/Eban451/Proyecto-Personal-Eban/blob/master/screenshots/Mapa.png?raw=true)

## Rúbrica de evaluación: 
Por último dejo las ubicaciones de los puntos de la rúbrica de evaluación:

#### Consultas base de datos
- https://github.com/Eban451/PORTAFOLIO-TALENTO-DIGITAL-API.git

#### Algoritmo de cálculo y manipulación de archivos de texto
- Todos los puntos están a lo largo de todos los archivos de la aplicación
- Manipulación de archivos
  - [PORTAFOLIO-TALENTO-DIGITAL: profile.hbs y funcionalidad en routes.js desde la línea 51 a 80]

#### Página web y html
- Todos los puntos están a lo largo de todos los archivos de la aplicación

#### Lenguaje Node
- Inclusión de paquetes y librerías de usuario 
- Agrupación del código y separación por funcionalidad
- Utilización de funciones asíncronas
- Lectura de parámetros de entrada
   - Todos los puntos anteriores están a lo largo de todos los archivos de la aplicación
- Funcionamiento general del aplicativo
   - [PORTAFOLIO-TALENTO-DIGITAL: ver hbs mantenedor.hbs, mantenedor.hbs y mapa.hbs, igualmente ver loginregistro.hbs]
#### Conexión a base de datos
- Manejo de conexión a base de datos desde Node
   - Ver: https://github.com/Eban451/PORTAFOLIO-TALENTO-DIGITAL-API.git
   - [PORTAFOLIO-TALENTO-DIGITAL: ver dbConfig.js]
- Manejo y ejecución de consultas desde Node
   - Ver: https://github.com/Eban451/PORTAFOLIO-TALENTO-DIGITAL-API.git
   - [PORTAFOLIO-TALENTO-DIGITAL: ver rutas y mantenedores en routes.js]

#### Uso de Express
- Creación servicio Rest con Express
   - Ver: https://github.com/Eban451/PORTAFOLIO-TALENTO-DIGITAL-API.git
   - [PORTAFOLIO-TALENTO-DIGITAL: ver Registro, Login y Mantenedores en routes.js desde la línea 140 hasta la 429]