import { Module } from '@nestjs/common';
import { UsesrService } from './usesr.service';
import { UsesrController } from './usesr.controller';
// import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  controllers: [UsesrController],
  providers: [UsesrService],
})
export class UsesrModule {}
