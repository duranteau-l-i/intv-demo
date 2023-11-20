import { IsString } from 'class-validator';

class SignInDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export default SignInDTO;
