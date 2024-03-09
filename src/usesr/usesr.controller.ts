import { Controller } from '@nestjs/common';
import { UsesrService } from './usesr.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('usesr')
export class UsesrController {
  constructor(private readonly usesrService: UsesrService) {}
}
