import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../../entities/admin.entity';
import { LoginDto } from '../../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<{ username: string; id: number }> {
    const { username, password } = loginDto;

    const admin = await this.adminRepository.findOne({
      where: { username, isActive: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Ungültige Anmeldedaten');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Ungültige Anmeldedaten');
    }

    return {
      username: admin.username,
      id: admin.id,
    };
  }

  async createAdmin(username: string, password: string): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = this.adminRepository.create({
      username,
      password: hashedPassword,
    });

    return this.adminRepository.save(admin);
  }
}
