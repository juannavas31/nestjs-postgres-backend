
import { ProfilePostDto } from 'src/profile/model/profile.dto';
import { generateRandomName } from '../utils/dataGenerator';

export class ProfileMock {
  public static getDto(): ProfilePostDto {
    return {
      name: `Anonymous ${generateRandomName(6)}`,
      emailAddress: `${generateRandomName(8, true)}@company.com`,
      companyName: `Company ${generateRandomName(6)}`,
      role: 'Supervisor',
    };
  }
}
