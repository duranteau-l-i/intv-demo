import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('user')
class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @CreateDateColumn()
  created: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

export default UserEntity;
