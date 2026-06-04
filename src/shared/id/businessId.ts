import { ValidationException } from 'src/shared/exception/validation.exception';

export class BusinessId {
  private constructor(public readonly value: string) {}

  static of(value: string): BusinessId {
    if (!value.trim()) {
      throw new ValidationException('value is empty');
    }

    return new BusinessId(value);
  }
}
