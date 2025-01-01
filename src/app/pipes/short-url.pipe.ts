import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortUrl',
  standalone: true
})
export class ShortUrlPipe implements PipeTransform {

  transform(url: string): string {
    if (!url) return '';

    const match = url.match(/^(www\.[^\/]+)(\/|$)/);
    return match ? match[1] : url;
  }

}
