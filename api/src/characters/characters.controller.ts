import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, AuthRequest } from '../auth/guards';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly svc: CharactersService) {}

  /** Returns the character for the authenticated account, or 404 if none exists. */
  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req: AuthRequest) {
    const character = await this.svc.findByAccount(req.user.sub);
    if (!character) throw new NotFoundException('No character for this account');
    return character;
  }

  /** Creates a new character for the account. 409 if account already has one or display name is taken. */
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: AuthRequest, @Body() dto: CreateCharacterDto) {
    const existing = await this.svc.findByAccount(req.user.sub);
    if (existing) throw new ConflictException('Account already has a character');
    return this.svc.create(req.user.sub, dto.displayName, dto.allegiance);
  }
}
