
import {
  IsBoolean,
  IsDefined, IsEmail, IsOptional, IsString, IsUrl, Length, Matches,
} from 'class-validator';
import { regExp, textLength } from 'src/common/validations';

export class ProfilePostDto {
  /**
   * Name of the profile.
   */
  @IsString()
  @IsDefined()
  @Length(textLength.min, textLength.short)
  @Matches(regExp.intTextDotHyphenSpace)
    name!: string;

  /**
   * Email address of the profile.
   */
  @IsEmail()
  @IsDefined()
    emailAddress!: string;

  /**
   * Company name of the profile.
   */
  @IsString()
  @IsDefined()
  @Length(textLength.min, textLength.short)
  @Matches(regExp.intTextDotHyphenSpace)
    companyName!: string;

  /**
   * Company name of the profile.
   */
  @IsString()
  @IsDefined()
  @Length(textLength.min, textLength.short)
    role!: string;
}
