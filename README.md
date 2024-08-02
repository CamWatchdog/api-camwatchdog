## 💻 Technologies

- [Nest](https://nestjs.com/)
- [Typescript](https://www.typescriptlang.org)
- [TypeORM](https://typeorm.io/)
- [Docker](https://www.docker.com)
- [PostgreSQL](https://www.postgresql.org)

## 🔥 Installation

1. Clone the repo

   ```sh
   $ git clone https://github.com/edvschvlz/nest-crud.git
   ```

### Running the database with docker-compose

1. Configure environment variables, create a file called `.env` like `.env.example` (you can basically copy and paste)

2. Run the command

   ```sh
   $ docker-compose up -d
   ```

3. If you want to stop it
   ```sh
   $ docker-compose down
   ```

### Running application

1. Configure environment variables, create a file called `.env` like `.env.example` (you can basically copy and paste)

2. Install dependencies

   ```sh
   $ npm install
   ```

3. Run the app

   ```
   $ npm run start
   ```

4. The app will be exposed on port `1880`

## API Reference

- [Postman Documentation](https://health-vision.postman.co/workspace/health-vision~a6d706c0-da82-4011-a099-ec5b64ae0e4a/api/3267a316-a8f8-43e2-94d2-f6388367ca1f?action=share&creator=22322915)