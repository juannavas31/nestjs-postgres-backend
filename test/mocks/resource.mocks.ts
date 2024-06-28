
import { ResourcePostDto } from 'src/resource/model/resource.dto';
import { generateRandomName } from '../utils/dataGenerator';

export class ResourceMock {
  public static getDto(profileId: string): ResourcePostDto {
    return {
      name: `resource-${generateRandomName(6)}`,
      address: generateRandomName(10),
      profileId,
    };
  }
}