import { IsIn, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

const ALLEGIANCES = ['Davion', 'Steiner', 'Liao', 'Marik', 'Kurita'] as const;

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(64)
  displayName!: string;

  @IsString()
  @IsIn(ALLEGIANCES)
  allegiance!: string;
}
