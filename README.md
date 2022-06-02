# Gateways

Project developed in response to a talent adquisition test with the following requeriments:

## Conditions

You have to prepare a solution to the proposed problem in the defined period of time. The solution must comply with the requirements. For anything not explicitly listed, you are free to choose whatever technology/library/tool you feel comfortable with.

Once ready, you must send a package with the source code of the solution, so it can be built and reviewed by Musala Soft. Instructions how to use the solution must also be provided (resource names, SQL scripts to import test data, other scripts, etc.).
If you have completed the task after the deadline has expired, you are still encouraged to submit a solution.

## Software Requirements

- Programming language: JavaScript
- Framework: Node.js/JavaScript + Angular/React or other
- Database: MongoDB or in-memory
- Automated build: Solution of choice

## Description

This sample project is managing gateways - master devices that control multiple peripheral devices.
Your task is to create a REST service (JSON/HTTP) for storing information about these gateways and their associated devices. This information must be stored in the database.

When storing a gateway, any field marked as “to be validated” must be validated and an error returned if it is invalid. Also, no more that 10 peripheral devices are allowed for a gateway.

The service must also offer an operation for displaying information about all stored gateways (and their devices) and an operation for displaying details for a single gateway. Finally, it must be possible to add and remove a device from a gateway.

### Each gateway has:

- a unique serial number (string),
- human-readable name (string),
- IPv4 address (to be validated),
- multiple associated peripheral devices.

### Each peripheral device has:

- a UID (number),
- vendor (string),
- date created,
- status - online/offline.

## Other considerations

Please, provide

- Basic UI - recommended or (providing test data for Postman (or other rest client) if you do not have enough time.
- Meaningful Unit tests.
- Readme file with installation guides.
- An automated build.

# Structure

The project contains an [Api backend project](./api/README.md) and a [Client frontend project](./client/README.md) which can be globally treated as a single project from current directory due to the use of [shelljs](https://www.npmjs.com/package/shelljs)

# Setup

## Database!!

A working [MongoDB](https://www.mongodb.com/es) database URL is **REQUIRED** by the project to work. It is required to be defined as an [environment variable](#environment)

## Environment

The project supports the following environment variables:

- **DATABASE_URL** (required): It's the URL to the mongoDB database to be used by the project
- **STATIC_CONTENT_PATH**: It's the path to a static distribution folder to be served as SPA (fallback to index.html). The default value is `../client/dist`, which is the distribution folder of the client
- **PORT**: Defines the port where application should be listening. (Default is 3001);
- **HOST**: Defines the host where application should be listening

### Environment configuration

The environment variables can be set globally or as defined in the [Environment](./api/README.md/#environment) section of the API documentation.

## Install

```
npm install
```

## Run

### Development

```
npm run dev
```

### Production

```
npm start
```

## Testing

### Unit testing

Api unit testing with [jest](https://www.jest.org.in/joint-entrance-screening-test)

```
npm run test-api
```

### End to end testing with [Cypress](https://www.cypress.io/)

```
npm test
```

# Usage

The most basic usage will be running

```
npm install
npm start
```

This will install the [api](./api/) and [client](./client/) project if node_modules folder is missing in at least one of them. Then if tere's no "./dist" folder inside [client](./client/) project, the client project will be built. Then the API project is started (it should connect to database and serve the static content if environment is configured properly, see [Environment ](#environment) section )

After the app is installed, it can be re-installed (both api and client) by running

```
npm run install
```

After the client is built, it can be re-built by running

```
npm run build-client
```

# Recomendations (TODO's)

- Propose a distribution strategy. Some way to isolate the client's distribution folder along with a compact (maybe uglified) version of the api/server

- Add some presentation and styling for Home and NotFound pages or remove them. It's pending since it's considered to be way far from the main objective of the exercise

- Validate gateway endpoint so it doesn't allow editing the device's property if there are duplicated device \_id's

- Implement lazy load for the page to load faster 

### In code

- [Validation timeout reset](./client/src/components/common/CrudTextEdit.tsx#L36)
  Timeout is not being reset properly

- [Handle 'required' property for forms](./client/src/components/common/CrudTextEdit.tsx#L60)

- [Separate selector component](./client/src/components/gateway/GatewayDeviceCard.tsx#L32)
  Create 2 components, one for displaying the device information and the other for add the device.
