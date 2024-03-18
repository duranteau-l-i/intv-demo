import { IsString, MinLength } from 'class-validator';

class UpdateUserDTO {
  @IsString()
  @MinLength(3)
  firstName: string;

  @IsString()
  @MinLength(3)
  lastName: string;
}

export default UpdateUserDTO;
