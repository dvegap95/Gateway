# Gateway API

It's responsible for serving the client web application and all the required API endpoints

# Setup

This project uses [Express](https://www.npmjs.com/package/express) over [Node.js](https://nodejs.org/)

## Environment

The production environment can be overridden by creating a file named `prod.env` in the project's root directory and declare the environment variables inside.
eg:

```
STATIC_CONTENT_PATH="../client/dist"
PORT="8080"
```

For jest unit testing, the `test.env` file, if exists inside the project's root directory; it will override the global environment configuration.

### Variables

The project supports the following environment variables:

- **DATABASE_URL** (required): It's the URL to the mongoDB [database](#database) to be used by the project
- **STATIC_CONTENT_PATH**: It's the path to a static distribution folder to be served as SPA (fallback to index.html). The default value is `../client/dist`, which is the distribution folder of the client
- **PORT**: Defines the port where application should be listening. (Default is 3001);
- **HOST**: Defines the host where application should be listening

## Database!!
A working [MongoDB](https://www.mongodb.com/es) database URL is **REQUIRED** by the project to work. It is required to be defined as an environment variable
## Install

```
npm install
```

## Run

```
npm start
```

## Testing

### Unit testing for components

[jest](https://www.npmjs.com/package/jest) and [supertest](https://www.npmjs.com/package/supertest) packages are used for unit testing

standard:

```
npm test
```

for keep running tests watching for changes:

```
npm run test-watch
```

# Endpoints

## [/api/gateways](./src/routes/gatewayRoutes.js):

- Handles the gateway's CRUD operations using the methods `POST`, `GET`, `PATCH` and `DELETE`
## [/api/peripheral-devices](./src/routes/peripheralDeviceRoutes.js):

- Handles the devices's CRUD operations using the methods `POST`, `GET`, `PATCH` and `DELETE`
