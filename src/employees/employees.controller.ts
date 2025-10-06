import { Controller, Get, Param, Query,Post,Body } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeDto } from './dto/employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // GET /employees?source=a or source=b
  // Sab employees list karo

  

  @Get()
  findAll(@Query('source') source: string): EmployeeDto[] {
    return this.employeesService.findAll(source);
  }

  // GET /employees/1?source=a 
  // Single employee by ID
  @Get(':id')
  findOne(
    @Param('id') id: string, 
    @Query('source') source: string
  ): EmployeeDto {
    return this.employeesService.findOne(id, source);
  }

  // POST /employees - Simple add A or B to DTO "DB"
  // Body: A or B data + required "format"
  // ID from client (in A/B fields)
  @Post()
  create(
    @Body() employeeData: any,    // Raw A or B data 
    @Body('format') format: string  // Required "a" or "b"
  ): EmployeeDto {
    return this.employeesService.create(employeeData, format);
  }

//http://localhost:3000/employees?source=unified
//http://localhost:3000/employees?source=a
//http://localhost:3000/employees/1?source=a
}
