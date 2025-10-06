import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
  
  // Data Source A - Different field names
  private readonly dataSourceA = [
    {
      id: "1",
      fName: "John",
      lName: "Doe", 
      mail: "john.doe@example.com",
      dept: "Engineering"
    },
    {
      id: "2",
      fName: "Alice",
      lName: "Johnson",
      mail: "alice.johnson@example.com", 
      dept: "Marketing"
    }
  ];

  // Data Source B - Different field names
  private readonly dataSourceB = [
    {
      emp_id: "101",
      FirstName: "Jane",
      LastName: "Smith",
      emailAddress: "jane.smith@example.com",
      division: "Product"
    },
    {
      emp_id: "102", 
      FirstName: "Bob",
      LastName: "Wilson",
      emailAddress: "bob.wilson@example.com",
      division: "Sales"
    }
  ];

  // data source c 

  private readonly unifiedEmployees: EmployeeDto[] = [];

  // All employees fetch karo based on source
  findAll(source: string): EmployeeDto[] {
    if (source === 'a') {
      // Source A data ko normalize karo
      return this.dataSourceA.map(emp => this.normalizeFromSourceA(emp));
    } else if (source === 'b') {
      // Source B data ko normalize karo  
      return this.dataSourceB.map(emp => this.normalizeFromSourceB(emp));
    } 
    else if (source === 'unified') {
    return this.findAllUnified();
  }
    else {
      throw new NotFoundException('Invalid source. Use "a" or "b"');
    }
  }

  findAllUnified(): EmployeeDto[] {
  return [...this.unifiedEmployees];  // Copy to avoid direct mutation (safe)
}

  // Single employee fetch karo by ID and source
  findOne(id: string, source: string): EmployeeDto {
    if (source === 'a') {
      const employee = this.dataSourceA.find(emp => emp.id === id);
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found in source A`);
      }
      return this.normalizeFromSourceA(employee);
    } else if (source === 'b') {
      const employee = this.dataSourceB.find(emp => emp.emp_id === id);
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found in source B`);
      }
      return this.normalizeFromSourceB(employee);
    } else {
      throw new NotFoundException('Invalid source. Use "a" or "b"');
    }
  }

  create(employeeData: any, format: string): EmployeeDto {
    // Normalize A/B data to DTO
    const normalized = this.normalizeToDto(employeeData, format);

    // Add to "database" (unified array)
    this.unifiedEmployees.push(normalized);

    return normalized;
  }

  // Source A data ko common schema mein convert karo
  private normalizeFromSourceA(employee: any): EmployeeDto {
    return {
      id: employee.id,
      first_name: employee.fName,      // fName -> first_name
      last_name: employee.lName,       // lName -> last_name  
      email: employee.mail,            // mail -> email
      department: employee.dept        // dept -> department
    };
  }

  // Source B data ko common schema mein convert karo
  private normalizeFromSourceB(employee: any): EmployeeDto {
    return {
      id: employee.emp_id,             // emp_id -> id
      first_name: employee.FirstName,  // FirstName -> first_name
      last_name: employee.LastName,    // LastName -> last_name
      email: employee.emailAddress,    // emailAddress -> email  
      department: employee.division    // division -> department
    };
  }

  // UPDATED: Simple reverse normalization - Only 'a' or 'b', ID required from client
// Throws error if format invalid or fields (including ID) missing
private normalizeToDto(employeeData: any, format: string): EmployeeDto {
  // Required format check - throw if invalid
  if (!format || (format !== 'a' && format !== 'b')) {
    throw new NotFoundException('Format must be "a" or "b"');
  }

  let normalized: EmployeeDto | undefined;  // Fixed: Initialize as undefined

  if (format === 'a') {
    // Source A: id, fName, lName, mail, dept - All required
    if (!employeeData.id || !employeeData.fName || !employeeData.lName || !employeeData.mail || !employeeData.dept) {
      throw new NotFoundException('For format "a", provide id, fName, lName, mail, dept');
    }
    normalized = this.normalizeFromSourceA(employeeData);  // Assign here
  } else if (format === 'b') {
    // Source B: emp_id, FirstName, LastName, emailAddress, division - All required
    if (!employeeData.emp_id || !employeeData.FirstName || !employeeData.LastName || !employeeData.emailAddress || !employeeData.division) {
      throw new NotFoundException('For format "b", provide emp_id, FirstName, LastName, emailAddress, division');
    }
    normalized = this.normalizeFromSourceB(employeeData);  // Assign here
  }

  // Fixed: Ensure normalized is assigned before return (TS safe)
  if (!normalized) {
    throw new NotFoundException('Invalid data format - normalization failed');
  }

  return normalized;
}

}
