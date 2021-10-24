import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastZero', async: false })
export class AtLeastZero implements ValidatorConstraintInterface {
  validate(number: number) {
    return number > 0;
  }

  defaultMessage() {
    return 'Number has to be more than zero';
  }
}
