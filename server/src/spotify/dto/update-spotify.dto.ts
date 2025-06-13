import { PartialType } from '@nestjs/mapped-types';
import { CreateSpotifyDto } from './create-spotify.dto';

export class UpdateSpotifyDto extends PartialType(CreateSpotifyDto) {}
