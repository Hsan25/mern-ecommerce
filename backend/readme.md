# Backend (Express.js)

This folder contains the backend of the MERN e-commerce application, built with Node.js, Express.js, and MongoDB.

## Installation

install dependencies

```bash
pnpm install
```


## Seeding the Database

To seed the database with initial data (like creating an admin user), you'll need to run a seed script. The backend should handle this automatically when you start the server.

Ensure that MongoDB is running, and then run the following command inside the backend folder to seed the database:

```bash
pnpm seed
```
The seed script will:

    Create an initial admin user using the email and password defined in the .env file.


## Running Application

```bash
pnpm dev
```
Application running on http://localhost:3001.

## notes

view docs in url:
```
http://localhost:3001/api/docs
```