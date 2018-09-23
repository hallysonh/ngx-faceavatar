import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  safeImage: SafeUrl;
  dim = 200;
  padding = 40;
  rounded = true;
  images = ['image1', 'image2', 'image3', 'image4'];

  private _imageSrc: string;
  get imageSrc() {
    return this._imageSrc;
  }
  set imageSrc(value: string) {
    if (this._imageSrc === value) {
      return;
    }
    this._imageSrc = value;
    this.safeImage = value ? this._sanitizer.bypassSecurityTrustUrl(this.imageSrc) : value;
  }

  set imageFile(value: File) {
    this.imageSrc = URL.createObjectURL(value);
  }

  constructor(private _sanitizer: DomSanitizer) {
    this.imageSrc = this.imagePath(this.images[0]);
  }

  imagePath(imageName: string) {
    return `assets/${imageName}.jpg`;
  }

  isValid() {
    return (
      this.imageSrc &&
      this.imageSrc.length > 0 &&
      (this.imageSrc.match(/\.(jpg|gif|webp|png|jpeg|bmp)$/gi) || this.imageSrc.startsWith('blob:'))
    );
  }
}
