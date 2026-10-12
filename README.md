<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Ejecutar en desarrollo (backend utilizando Postgres)

1. Clonar Repositorio
2. Ejecutar
```
yarn install
```

3. Tener Nest CLI instalado
```
npm i -g @nest/cli
```

4. Renombrar el .env.example -> .env y llenar variables de entorno

5. Levantar la base de datos
```
docker-compose up -d
```