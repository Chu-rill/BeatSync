import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { CreateSpotifyDto } from './dto/create-spotify.dto';
import { UpdateSpotifyDto } from './dto/update-spotify.dto';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Post()
  create(@Body() createSpotifyDto: CreateSpotifyDto) {
    return this.spotifyService.create(createSpotifyDto);
  }

  @Get()
  findAll() {
    return this.spotifyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spotifyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpotifyDto: UpdateSpotifyDto) {
    return this.spotifyService.update(+id, updateSpotifyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spotifyService.remove(+id);
  }
}
