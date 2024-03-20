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

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  created: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

export default UserEntity;
