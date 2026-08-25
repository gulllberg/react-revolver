# React Revolver

React Revolver is a revolving infinite carousel in React.

## Motivation

Q: What is a revolver?  
A: Something that revolves!

Q: Why is the prop called bullets? (Instead of items/steps/slides/etc)  
A: Bullets are what you put in a revolver (the gun version...).

Q: Do I need this?  
A: Possibly not. There are already a lot of React carousels out there. I wanted a minimalist one that allows for infinite revolving without adding an infinite number of clones to the DOM, and could not find one that did that.

Q: How does it work?  
A: The bullets are cloned twice, and then the three copies are juggled around so that it all looks good however you interact with the Revolver. (Since they are copied, make sure they don't perform any side effect that should not be performed more than once.)

## Installation

```npm i react-revolver```

## Usage

```
import React from 'react';
import ReactRevolver from 'react-revolver';
import 'react-revolver/style.css';

<ReactRevolver
    numberOfColumns={3}
    bullets={[
        <Item />,
        <Item />,
        <Item />,
        <Item />,
        <Item />,
    ]}
/>
```

The content will get the same height (decided by the tallest one). You can thus set your item height to 100 %, and they will all be equally tall.

See a full usage example [here](https://github.com/gulllberg/react-revolver-demo) or a deployed demo [here](https://gulllberg.github.io/react-revolver-demo/).

## Props

```bullets (required)``` - the items you want to show in the Revolver  
```numberOfColumns (required)``` - how many items to show simultaneously  
```arrowOverhangMode (optional)``` = ```none|some|all (default)``` (choices can be imported via ```import {arrowOverhangModes} from 'react-revolver';```) - how much the arrows extend outside the Revolver container  
```hideArrows (optional)``` = ```false (default)``` - hide the previous/next arrow buttons  
```hideBalls (optional)``` = ```false (default)``` - hide the footer ball pagination indicators  
```startingIndex (optional)``` = ```0 (default)``` - the bullet index to show initially (out-of-range values are clamped and logged as a console warning)

## Methods

```goToIndex```  
```next```  
```previous```

Attach a ref to control the Revolver from your app.

## I want the Revolver to do X

### Customise the styling

Instead of importing the Revolver css, copy it, modify it to your liking and import that in your app. (Each bullet's width, transform and transition are controlled by the Revolver via style and could/should not be modified.)

### Something else

Please open an issue or PR.

## Development

```
npm install
npm run dev     # starts a Vite dev server with a small playground
npm test        # Vitest + React Testing Library
npm run build   # produces dist/ (ESM + CJS + types + css)
```

## Changelog

See [CHANGELOG.md](https://github.com/gulllberg/react-revolver/blob/main/CHANGELOG.md), including breaking changes and upgrade notes.

## License

[MIT](https://github.com/gulllberg/react-revolver/blob/main/LICENSE)
