import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsThisExsistConstraint implements ValidatorConstraintInterface {
  validate(userName: any, args: ValidationArguments) {
    return true;
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  //Object
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsThisExsistConstraint,
    });
  };
}
