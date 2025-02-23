import { AbstractEntity } from 'src/core/entities/abstract.entity';
import { Column, Entity, TableInheritance } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  INVESTOR = 'investor',
}

@Entity('users')
//@TableInheritance({ column: { type: 'enum', name: 'role', enum: UserRole } })
export class User extends AbstractEntity {
  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: string;
}
