import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslateService } from '../services/translate.service';
import { Subscription } from 'rxjs';

@Pipe({ name: 'translate', pure: false, standalone: true })
export class TranslatePipe implements PipeTransform, OnDestroy {
  private lastKey: string | null = null;
  private lastParams: any = null;
  private translated = '';
  private sub: Subscription;

  constructor(private translateService: TranslateService, private cdr: ChangeDetectorRef) {
    this.sub = this.translateService.lang$.subscribe(() => {
      // force update when language changes
      this.translated = '';
      this.cdr.markForCheck();
    });
  }

  transform(key: string, params?: any): string {
    if (!key) return '';
    const paramsChanged = JSON.stringify(this.lastParams) !== JSON.stringify(params);
    if (this.lastKey === key && !paramsChanged && this.translated) {
      return this.translated;
    }
    this.lastKey = key;
    this.lastParams = params;
    this.translated = this.translateService.translate(key, params);
    return this.translated;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
