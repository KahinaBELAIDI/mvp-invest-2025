import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InvestorsService } from 'src/investors/investors.service';
import { UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service'; // Adjust path to your actual UserService location
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly investorsService: InvestorsService,
    private readonly jwtService: JwtService,
  ) {}

  // Login function
  async login(loginDto: LoginDto): Promise<{ token: string; role: UserRole }> {
    let user;
    const { email, password } = loginDto;

    // Attempt to find the user in both User and Investor tables
    user = await this.usersService.findByEmail(email); // Search in the User table

    if (!user) {
      user = await this.investorsService.findOneByEmail(email); // Search in the Investor table if not found in User table
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT token
    const payload = { id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    // Return the token and user role
    return { token, role: user.role };
  }
}
