import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.getUser(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    const user = await this.getUser(id);
    this.usersService.remove(id);
    const fullName = user.firstName + ' ' + user.lastName
    return `User: ${fullName} is deleted.`;
  }

  private async getUser(id: string) {
    const user = await this.usersService.findOne(id);
    if (user === undefined) { throw new HttpException(`There is no user. (id: ${id})`, HttpStatus.NOT_FOUND); }
    return user;
  }
}
