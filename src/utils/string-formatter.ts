
import * as util from 'util';

export enum ErrorMessage {
  ENTITY_NOT_FOUND_FOR_ID = 'Entity %s with id %s does not exist.',
  ENTITY_NOT_FOUND_FOR_ENTITY_ID = 'Entity %s related with %s id %s does not exist.',
  ENTITY_ALREADY_EXISTS_WITH_NAME = 'Entity %s with name (%s) already exists.',
  ENTITY_NOT_FOUND_FOR_PROPERTY = 'Entity %s with property %s does not exist.',
  ENTITY_ALREADY_EXISTS_WITH_ID = 'Entity %s with id %s already exists.',
  WRONG_QUERY_PARAMS = 'Either "owner" or "subscriber" query parameter is required',
  WRONG_NAME_VALIDATION_PARAMETER = 'The provided name type (%s) is not valid. Valid types are node, channel and dapp',
}

export class StringFormatter {
  public static format(format?: any, ...param: any[]): string {
    return util.format(format, ...param);
  }
}
