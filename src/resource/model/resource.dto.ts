
import {
  IsDefined, IsEmail, IsOptional, IsString, IsUrl, Length, Matches,
} from 'class-validator';
import { regExp, textLength } from 'src/common/validations';

export class ResourcePostDto {
  /**
   * Name of the resource.
   */
  @IsString()
  @IsDefined()
    name!: string;

  /**
   * address of the resource. it can be an url, blockchain address, etc.
   */
  @IsDefined()
    address!: string;

  /**
   * Owner of the resource.
   */
  @IsString()
  @IsDefined()
    profileId!: string;
}
