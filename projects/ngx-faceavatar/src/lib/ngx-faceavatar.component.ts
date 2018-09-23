import { Component, Input, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

//#region DEFINITIONS
const DEFAULT_DIM = 300;
const DEFAULT_PADDING = 10;
const DEFAULT_ROUNDED = true;
const DEFAULT_IMG =
  // tslint:disable-next-line:max-line-length quotemark
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg enable-background='new 0 0 300 300' version='1.1' viewBox='0 0 300 300' width='300px' height='300px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0 0v300h300v-300h-300zm150.1 49.5c28.5 0.1 51.4 23 51.4 51.5 0 28.4-23.1 51.4-51.5 51.4-28.5-0.1-51.5-23.2-51.4-51.6 0.1-28.5 23.1-51.4 51.5-51.3zm97.2 180.8c-20.1 20-43.9 32.9-71.8 38.2-16.3 3.1-32.7 3.2-49.1 0.3-28.7-5.1-53.2-18.1-73.7-38.6-0.7-0.7-0.7-1.2-0.4-2.1 8.9-22.9 24.2-39.8 46.8-49.7 9.1-4 18.7-5.8 28.7-5.7h22.2c7.2 0 14.4 0.1 21.6 0 17.2-0.2 32.6 5.2 46.3 15.5 13.9 10.4 23.8 23.7 29.9 40 0.3 0.8 0.2 1.4-0.5 2.1z'/%3E%3C/svg%3E%0A";

interface DOMRectReadOnly {
  x: number;
  y: number;
  width: number;
  height: number;
}
//#endregion

@Component({
  selector: 'ngx-faceavatar',
  template: `
    <div [ngClass]="{ rounded: rounded }" [style.width]="dim+ 'px'" [style.height]="dim + 'px'">
      <canvas #faceAvatarCanvas [width]="dim" [height]="dim"></canvas>
    </div>
  `,
  styles: [
    `
      :host > div {
        display: flex;
        overflow: hidden;
        border-radius: 0;
        transition: all 0.4s;
      }
      :host > div.rounded {
        border-radius: 100%;
      }
    `
  ]
})
export class NgxFaceAvatarComponent implements AfterViewInit {
  //#region input src
  private _src;
  get src() {
    return this._src;
  }
  @Input()
  set src(value: string | File) {
    value = value || DEFAULT_IMG;
    if (this._src === value) {
      return;
    }

    this._src = value instanceof File ? URL.createObjectURL(this.src) : value;
    this.image = new Image();
    this.image.onload = () => {
      this.face = this.ajustDim({ x: 0, y: 0, width: this.image.width, height: this.image.height });
      this.updateRenderParams();
    };
    this.image.onerror = e => {
      this.image.src = DEFAULT_IMG;
    };
    this.image.src = this._src as string;
  }
  //#endregion

  //#region input dim
  private _dim = DEFAULT_DIM;
  get dim() {
    return this._dim;
  }
  @Input()
  set dim(value: number) {
    if (this._dim === value) {
      return;
    }
    this._dim = value;
    if (this.isRenderPending) {
      return;
    }
    setTimeout(() => {
      this.isRenderPending = true;
      this.drawFace();
    }, 0);
  }
  //#endregion

  //#region input padding
  private _padding = DEFAULT_PADDING;
  get padding() {
    return this._padding;
  }
  @Input()
  set padding(value: number) {
    if (this._padding === value) {
      return;
    }
    this._padding = value;
    this.updateSettings();
  }
  //#endregion

  //#region input rounded
  @Input()
  rounded = DEFAULT_ROUNDED;
  //#endregion

  //#region face
  private set face(value: DOMRectReadOnly) {
    this.detectionResult = { result: false, original: value, face: value };
  }

  private get face() {
    return this.detectionResult && this.detectionResult.face;
  }
  //#endregion

  @ViewChild('faceAvatarCanvas')
  canvas: ElementRef<HTMLCanvasElement>;

  private image: HTMLImageElement;
  private detectionResult: { result: boolean; original: DOMRectReadOnly; face: DOMRectReadOnly };
  private isRenderPending = true;

  constructor(@Inject(PLATFORM_ID) private platformId) {}

  ngAfterViewInit(): void {
    this.drawFace();
  }

  private async updateRenderParams() {
    await this.detectMainFace();
    this.isRenderPending = true;
    this.drawFace();
  }

  private drawFace() {
    if (!this.face || !this.canvas || !this.isRenderPending) {
      return;
    }
    const c = this.canvas.nativeElement;
    const context = c.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, c.width, c.height);
    context.drawImage(this.image, this.face.x, this.face.y, this.face.width, this.face.height, 0, 0, this.dim, this.dim);
    this.isRenderPending = false;
  }

  private async detectMainFace() {
    if (isPlatformServer(this.platformId) || !window['FaceDetector']) {
      return;
    }

    const faceDetector = new window['FaceDetector']();
    const faces = await faceDetector.detect(this.image);
    if (faces.length === 0) {
      return;
    }

    let facesBox = faces.map(x => x.boundingBox);
    if (facesBox.length > 1) {
      facesBox = facesBox.sort((a, b) => b.width * b.height - a.width * a.height);
    }
    this.detectionResult = { result: true, original: facesBox[0], face: this.addPadding(facesBox[0]) };
  }

  private updateSettings() {
    if (!this.detectionResult) {
      return;
    }
    this.detectionResult.face = this.detectionResult.result
      ? this.addPadding(this.detectionResult.original)
      : this.ajustDim(this.detectionResult.original);
    this.isRenderPending = true;
    this.drawFace();
  }

  private addPadding(box: DOMRectReadOnly) {
    const nb = { x: box.x, y: box.y, width: box.width, height: box.height };
    const xp = nb.x < this.padding ? nb.x : this.padding;
    const yp = nb.y < this.padding ? nb.y : this.padding;
    nb.x = nb.x - xp;
    nb.y = nb.y - yp;
    nb.width = nb.width + xp * 2;
    nb.height = nb.height + yp * 2;
    return this.ajustDim(nb);
  }

  private ajustDim(box: DOMRectReadOnly) {
    const dim = Math.min(box.width, box.height);
    const nb = { x: box.x, y: box.y, width: box.width, height: box.height };
    nb.x = nb.x + (nb.width - dim) / 2;
    nb.y = nb.y + (nb.height - dim) / 2;
    nb.width = nb.height = dim;
    return nb;
  }
}
