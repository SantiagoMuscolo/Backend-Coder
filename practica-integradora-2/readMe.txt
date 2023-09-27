el proyecto cuenta con 3 rutas actualmente:

el home con la lista de productos sin socket: "/",
la lista con socket denominada realtimeproducts: "/realTimeProducts",
el chat con socket: "/chatHandlebars".

el sistema actual de la app se maneja con MongoDB utilizando Mongoose, sin embargo, aun permanecen los archivos
desarrollados previamente con FS por si decides chequearlos estan en carpetas denominadas "nombre-de-la-carpeta-FS".

brindare a continuacion las rutas de postaman para poder testear el proyecto:

ProductManager:

GET:
http://localhost:8080/api/products/

GET:
http://localhost:8080/api/products/:pid

POST:
http://localhost:8080/api/products/

PUT:
http://localhost:8080/api/products/:pid

DELETE:
http://localhost:8080/api/products/:pid


Carts:

GET:
http://localhost:8080/api/carts/

POST:
http://localhost:8080/api/products/

GET:
http://localhost:8080/api/products/:cid

POST:
http://localhost:8080/api/products/:cid/product/:pid


dejo el repositorio de GitHub para tenerlo a disposicion ante culquier necesidad de consulta:
https://github.com/SantiagoMuscolo/Backend-Coder/tree/master/practicaIntegradora1

