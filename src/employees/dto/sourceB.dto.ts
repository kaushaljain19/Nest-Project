import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SourceBDto {
  @IsString()
  @IsNotEmpty()
  emp_id: string;

  @IsString()
  @IsNotEmpty()
  FirstName: string;

  @IsString()
  @IsNotEmpty()
  LastName: string;

  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @IsString()
  @IsNotEmpty()
  division: string;
}
