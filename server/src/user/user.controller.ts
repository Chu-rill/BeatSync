import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "src/guard/auth.guard";
import { AuthRequest } from "src/types/auth.request";
import { FileInterceptor } from "@nestjs/platform-express";

@UseGuards(AuthGuard)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findOne(@Req() req: AuthRequest) {
    const id = req.user.id;
    return this.userService.getUser(id);
  }

  @Delete()
  async remove(@Req() req: AuthRequest) {
    const userId = req.user.id;
    return this.userService.remove(userId);
  }

  // @Post('/profile')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Req() req: AuthRequest,
  // ) {
  //   const userId = req.user?.id;
  //   return this.userService.uploadProfileImage(userId, file);
  // }
}
