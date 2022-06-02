# Gateways client

# Setup

[Vite](https://vitejs.dev/) was used to build this [React](https://es.reactjs.org/) project.

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
npm run build
npm run preview
```

## Testing

### Integration testing for views with [Cypress](https://www.cypress.io/)

```
npm test
```

# Usage

At the top of the page, a navigation bar is provided for the user to move around the different views

The project main view (HOME) contains links to the two main CRUD views where all the main application functionalities take place

## Gateways and Peripheral devices [CRUD](https://developer.mozilla.org/es/docs/Glossary/CRUD)'s

The existent elements information is displayed as a set of cards which also contain action buttons for edit and delete the element. There's also a special card at the end of the list which propose is to add a new element to the system.
For edition. There's a dialog listing all the properties of the element inside an interactive component that also allows their modification.

# Design

The mobile-first responsive design approach was taken and then the resultant components were modified to fit a desirable design for bigger screens.
