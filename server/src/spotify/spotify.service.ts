import { Injectable } from '@nestjs/common';
import { CreateSpotifyDto } from './dto/create-spotify.dto';
import { UpdateSpotifyDto } from './dto/update-spotify.dto';

@Injectable()
export class SpotifyService {
  create(createSpotifyDto: CreateSpotifyDto) {
    return 'This action adds a new spotify';
  }

  findAll() {
    return `This action returns all spotify`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spotify`;
  }

  update(id: number, updateSpotifyDto: UpdateSpotifyDto) {
    return `This action updates a #${id} spotify`;
  }

  remove(id: number) {
    return `This action removes a #${id} spotify`;
  }
}
