import { AbstractControl, ValidatorFn } from '@angular/forms';

export class HexValidator {

  static hexFormat(): ValidatorFn {
    const re = new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$');
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && !re.test(c.value)) {
        return { hexFormat: true };
      }
      return null;
    };
  }
}
