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

Igualmente se deben primero desplegar la API, disponible en: https://github.com/Eban451/PORTAFOLIO-TALENTO-DIGITAL-API.git
Y luego, como se menciona en la API, crea un usuario master, que es el que puede cambiar la categoría de otros usuarios,
ya que mediante el registro siempre serán solo usuarios básicos que no podrán generar nuevas ubicaciones, cosa que solo
puede hacer el Admin y los colaboradores que el administrador designe.

Recordar, que se debe crear al usuario de esta forma luego de poner en marcha la Base de datos según las instrucciones de la API:

```bash
INSERT INTO users(name,email,categoria,password) VALUES('Master','master123@gmail.com',1,'$2b$10$LTx/J3o9heeA1BZzpYd5U.pjcWiyv1TU0TRQWh3IOk8RJXXiR7PTa');
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
