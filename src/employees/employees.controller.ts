import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Patch,
  Delete
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeDto } from './dto/employee.dto';
import { SourceADto } from './dto/sourceA.dto';
import { SourceBDto } from './dto/sourceB.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // GET /employees?source=a or source=b
  // List all the employees

  @Get()
  findAll(@Query('source') source: string): EmployeeDto[] {
    return this.employeesService.findAll(source);
  }

  // GET /employees/1?source=a
  // Single employee by ID
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('source') source: string,
  ): EmployeeDto {
    return this.employeesService.findOne(id, source);
  }

  // POST /employees - Simple add A or B to DTO "DB"
  // Body: A or B data + required "format"
  // ID from client (in A/B fields)
  @Post()
  create(
    @Body() employeeData: SourceADto | SourceBDto, // Raw A or B data
    @Query('source') source: string, // Required "a" or "b"
  ): EmployeeDto {
    return this.employeesService.create(employeeData, source);
  }

  @Put(':id')
  update(
    @Body() employeeData: SourceADto | SourceBDto ,
    @Param('id') id: string,
    @Query('source') source: string,
  ): EmployeeDto {
    return this.employeesService.update(employeeData, id, source);
  }

  @Delete(':id')
  remove(@Param('id') id:string):EmployeeDto
{
  return this.employeesService.remove(id); 

}

}
