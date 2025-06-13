import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { DatabaseModule } from "src/infra/db/database.module";

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, UserService],
  imports: [DatabaseModule],
})
export class UserModule {}
