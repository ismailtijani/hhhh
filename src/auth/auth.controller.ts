import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** API Endpoint for User Registration */
  @ApiBadRequestResponse()
  @Post('signup')
  createUser(@Body() signupDetails: SignupDto) {
    return this.authService.createUser(signupDetails);
  }

  /** API Endpoint to Login User */
  @ApiUnauthorizedResponse({
    description:
      'Invalid Email or Password, Please check your login credentials',
  })
  @Post('login')
  @HttpCode(200)
  login(@Body() loginDetails: LoginDto) {
    return this.authService.login(loginDetails);
  }
}
