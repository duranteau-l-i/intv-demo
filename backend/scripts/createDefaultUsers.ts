import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
dotenv.config();

import UserEntity from '../src/modules/user/infrastructure/repositories/entities/User.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [UserEntity],
  synchronize: false,
}).initialize();

const insertDefaultAdmin = async () => {
  const source = await dataSource;

  const passwordHashed = await argon2.hash('Admin@123');

  await source.getRepository(UserEntity).save({
    id: 'd9497dbf-bb1d-4b15-8406-781f84c64c63',
    firstName: 'john',
    lastName: 'doe',
    email: 'admin@test.com',
    username: 'admin',
    password: passwordHashed,
    role: 'admin',
  });

  console.log(`Username: admin | Password: Admin@123 \n`);

  const passwordUserHashed = await argon2.hash('User@123');

  await source.getRepository(UserEntity).save({
    id: 'c04b4496-2a70-4c26-8962-adcca4f4594e',
    firstName: 'jane',
    lastName: 'doe',
    email: 'user@test.com',
    username: 'user',
    password: passwordUserHashed,
    role: 'user',
  });

  console.log(`Username: user | Password: User@123 \n`);

  process.exit(1);
};

insertDefaultAdmin();
