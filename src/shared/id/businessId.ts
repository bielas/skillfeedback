import { ValidationError } from 'src/shared/error/validation.error';

export class BusinessId {
  private constructor(public readonly value: string) {}

  static of(value: string): BusinessId {
    if (!value.trim()) {
      throw new ValidationError('value is empty');
    }

    return new BusinessId(value);
  }
}
