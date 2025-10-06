import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module'; // Import karo

@Module({
  imports: [EmployeesModule], // Add karo
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
