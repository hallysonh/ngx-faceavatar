# NgxFaceAvatar

[![version](https://img.shields.io/npm/v/ngx-faceavatar.svg)](http://npm.im/ngx-faceavatar)
[![MIT License](https://img.shields.io/github/license/hallysonh/ngx-faceavatar.svg)](https://opensource.org/licenses/MIT)

This is a Angular component to display an image as avatar using, if enable, the browser's native face recognition to focus on a face in the image. The algorithm always **focus on the biggest face** on the image.

## Demo

You can check the demo page [here](https://hallysonh.github.io/ngx-faceavatar/).

## Properties

- **src**: (Required)

  Source to be displayed. It can be a image url or a Image File.

- **dim** (Dimension): (Optional) Default value: _300_

  Define the width and height of the element

- **padding**: (Optional) Default value: _10_

  Define the space displayed around the detected face (if any was detected).

- **rounded**: (Optional) Default value: _true_

  Define if the component will be a circle (true) or a square (false).

## Getting started

Install via npm or yarn:

```bash
yarn add ngx-faceavatar
```

Import the module

```typescript
import { NgxFaceAvatarModule } from 'ngx-faceavatar';
// ...

@NgModule(
  // ...
  imports: [NgxFaceAvatarModule],
  // ...
})
```

and add the **ngx-faceavatar** to your component template:

```html
<ngx-faceavatar [src]="imageSrc" dim="200" padding="20" rounded="false"></ngx-faceavatar>
```

## Enable Face Recognition

In chrome, go to :

```text
chrome://flags/#enable-experimental-web-platform-features
```

And **enable** the **Experimental Web Platform features** section.

After enabling it you should see a **Relaunch Now** button on the bottom of the screen.

After the relaunch, you can see the component focusing on recognized faces.
