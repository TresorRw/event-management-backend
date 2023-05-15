### Event management system
This REPO contains all of the functionalities to serve frontend for this project

Table of Contents
- [Description](#description)
  - [Documentation](#documentation)
  - [Setup](#setup)
    - [Dependencies](#dependencies)
    - [Folder Structure](#folder-structure)
    - [Getting Started](#getting-started)
      - [Cloning the project](#cloning-the-project)
      - [Installing dependencies](#installing-dependencies)
      - [Run The Service](#run-the-service)

# Description
An event management platform that allows users to create and manage events. You can use GraphQL to implement features like event registration, attendee management, and event search.

## Documentation

This project have only one endpoint available for every single request.
`/graphql`

## Setup

### Dependencies

- GraphQL
- ExpressJS
- Apollo Server
- bcrypt
- jsonwebtoken
- cors
- dotenv
- mongoose
- nodemon

### Folder Structure
```
┣ 📂src
 ┃ ┣ 📂Schemas
 ┃ ┣ 📂interfaces
 ┃ ┣ 📂middlewares
 ┃ ┣ 📂models
 ┃ ┗ 📜app.ts
 ┣ 📜.env.example
 ┣ 📜.gitignore
 ┣ 📜README.md
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┗ 📜tsconfig.json
```
### Getting Started

#### Cloning the project
```bash
git clone https://github.com/TresorRw/event-management-backend.git
cd event-management-backend
```
#### Installing dependencies
```bash
npm i
```

#### Run The Service
```bash
npm start
```