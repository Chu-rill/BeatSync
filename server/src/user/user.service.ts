import { HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll() {
    const users = await this.userRepository.findUsers();
    if (!users) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: "No users found",
        data: null,
      };
    }
    // console.log(users);
    return {
      statusCode: HttpStatus.OK,
      message: "Users retrieved successfully",
      data: users,
    };
  }

  async getUser(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: "User not found",
        data: null,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: "User retrieved",
      data: user,
    };
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: string) {
    const user = await this.userRepository.delete(id);
    if (!user) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "User does not exist",
        data: null,
      };
    }
    return {
      statusCode: HttpStatus.OK,
      message: "User deleted successfully",
      data: user,
    };
  }
}
