import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/usesr/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    // Inject TypeORM repository into the service class to enable interaction with the database
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // Inject JTWService
    private readonly jwtService: JwtService,
    // Inject EmailService
    private readonly emailService: EmailService,
  ) {}

  async createUser(userDetails: SignupDto) {
    try {
      // Create a new user entity
      const newUser = this.userRepository.create(userDetails);
      //Save the new user to database
      const savedUser = await this.userRepository.save(newUser);
      // Generate JWT token payload
      const payload = { sub: savedUser.id, email: savedUser.email };
      // Send Welcome Email
      this.emailService.sendUserWelcomeEmail(savedUser, '12345'); // Create a Dto and generate token
      // Sign JWT token and return accessToken
      return { accessToken: await this.jwtService.signAsync(payload) };
    } catch (error: any) {
      return error.sqlMessage;
    }
  }

  login(loginDetails: LoginDto) {
    return this.findByCredentials(loginDetails);
  }

  //Find User by credentials
  async findByCredentials({ email, password }: LoginDto) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      // Validate user and password
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload = { sub: user.id, email: user.email };

        return { accessToken: await this.jwtService.signAsync(payload) };
      } else {
        // Throw UnauthorizedException if login credentials are incorrect
        throw new UnauthorizedException(
          'Invalid Email or Password, Please check your login credentials',
        );
      }
    } catch (error) {
      throw new InternalServerErrorException('Error finding user');
    }
  }
}
