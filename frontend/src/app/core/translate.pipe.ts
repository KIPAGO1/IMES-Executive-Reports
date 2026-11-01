import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'tr',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {

  private readonly translation = inject(TranslationService);

  transform(key: string | null | undefined): string {
    if (!key) {
      return '';
    }

    return this.translation.t(key);
  }
}