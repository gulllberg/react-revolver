# React Revolver

React Revolver is a revolving infinite carousel in React.

## Motivation

Q: What is a revolver?  
A: Something that revolves! (And a gun...)

Q: Why is the prop called bullets? (Instead of items/steps/slides/etc)  
A: Bullets are what you put in a revolver. And it sounds way cooler!

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
import 'react-revolver/dist/index.css';

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

## Props

```bullets (required)``` - the items you want to show in the Revolver  
```numberOfColumns (required)``` - how many items to show simultaneously  
```arrowOverhangMode (optional)``` = ```none|some|all (default)``` (choices can be imported via ```import {arrowOverhangModes} from 'react-revolver';```) - how much the arrows extend outside the Revolver container

## Methods

```goToIndex```  
```next```  
```previous```

Attach a ref to control the Revolver from your app.

## I want the Revolver to do X

### Update props after mounting the Revolver

Not currently possible, but will be fixed in the future. For now, you can force a remount by using a key.

```
<ReactRevolver
    key={counter} // Increase counter when the props change to force remount
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
### Customise the styling

Instead of importing the Revolver css, copy it, modify it to your liking and import that in your app. (Each bullet's width, transform and transition is controlled by the Revolver via style and could/should not be modified.)

### Remove arrows/balls

Not currently possible, but will be fixed in the future.

### Start on arbitrary index

Not currently possible, but will be fixed in the future.

### Something else

Please open an issue or PR.

## License

MIT, see separate license file.
