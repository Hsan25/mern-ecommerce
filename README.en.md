# MERN E-commerce Project

This is a full-stack e-commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js). The project is divided into two parts:

    Frontend: Located in the frontend folder, built with React and Next.js.
    Backend: Located in the backend folder, built with Express.js and MongoDB.

## Table of Contents

    Prerequisites
    Installation
        Clone the Repository
        Setup Environment Variables
        Install Dependencies
    Seeding the Database
    Running the Application
    Technologies Used

## Prerequisites

Before running the project, ensure you have the following installed on your system:

    Node.js: v14.x or higher
    pnpm: Used as the package manager
        You can install it globally using:
  ``` bash
   npm install -g pnpm
```
    MongoDB: Make sure MongoDB is installed and running locally or use MongoDB Atlas (a cloud-based solution).

## Installation
Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/Hsan25/mern-ecommerce.git
cd mern-ecommerce
```
## Setup Environment Variables

    Create .env files for both the frontend and backend folders.

#### Backend .env Example:

Create a .env file in the backend folder:

```bash
cd backend
touch .env
```
Fill the .env file in folder backend with the following `.env.example`
#### Frontend .env.local Example:

Create a .env.local file in the frontend folder:

```bash
cd frontend
touch .env.local
```

Fill the .env.local in folder frontend file with the following `.env.example`.
## Install Dependencies

Now, install dependencies for both the frontend and backend. You can do this from the root of the project.

```bash
# frontend
 pnpm install:frontend

# backend
 pnpm install:backend
```
This will install dependencies for both the frontend and backend folders.
## Seeding the Database

To seed the database with initial data (like creating an admin user), you'll need to run a seed script. The backend should handle this automatically when you start the server.

Ensure that MongoDB is running, and then run the following command inside the backend folder to seed the database:

```bash
 pnpm seed

 # or
 cd backend && pnpm seed

```
The seed script will:

    Create an initial admin user using the email and password defined in the .env file.

## Running the Application

Once everything is set up, you can run both the frontend and backend concurrently using pnpm:

From the root of the project, simply run:

```bash
# run backend
 pnpm dev:backend

#run frontend 
 pnpm dev:frontend
```
This will run both the frontend on http://localhost:3000 and the backend on http://localhost:3001.




## notes 
To add or edit products and others, you must enter the dashboard page as admin.
```
http://localhost:3000/id/dashboard
```
view docs backend in url:

http://localhost:3001/api/docs

*** If you find a problem in this project, please send a report. ***
## Technologies Used

    Frontend: React, Next.js, TypeScript
    Backend: Express.js, Node.js, MongoDB, TypeScript
    State Management: context react
    Authentication: JWT (JSON Web Token)
    Database: MongoDB with Mongoose

