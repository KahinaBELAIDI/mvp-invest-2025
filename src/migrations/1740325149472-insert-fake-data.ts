import { User, UserRole } from 'src/users/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InsertFakeData1740325149472 implements MigrationInterface {
  name = 'InsertFakeData1740325149472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.connection.getRepository(User);
    let pwdHash = await bcrypt.hash(
      'test2025',
      parseInt(process.env.SALT_ROUNDS) || 10,
    );
    await userRepository.insert({
      id: '52ce6877-f8d9-4f31-95e5-b7e5047c7484',
      email: 'admin@re.com',
      passwordHash: pwdHash,
      firstname: 'Admin',
      lastname: 'Admin',
      role: UserRole.ADMIN,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Do nothing');
  }
}
