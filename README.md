# Storybook + PostCSS 8 + TailwindCSS 2

Tailwind 2 and Storybook 6 has different compatibility of PostCSS - Tailwind 2 uses PostCSS 8 and Storybook 6 uses PostCSS 7.

This repository introduces some ways to make the project without compatibility problems.     
(Especially about: `Error: PostCSS plugin tailwindcss requires PostCSS 8.`)

<br />

## Create the Project

#### 1. Create the sample project with create-react-app.

```sh
npx create-react-app storybook-tailwindcss
cd storybook-tailwindcss
```

<br />

#### 2. Install tailwindcss.

```sh
yarn add -D tailwindcss@latest postcss@latest autoprefixer@latest
```

<br />

#### 3. Create `tailwind.config.js` with npx. (`-p` flag generates `postcss.config.js`)

```sh
npx tailwindcss init -p
```

There will be `tailwind.config.js` in the root directory.    
```javascript
module.exports = {
  mode: "jit", // enabling Jist In Time Compiler engine
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
```
(+ You could use [Tailwind JIT Compiler](https://tailwindcss.com/docs/just-in-time-mode), which is the new feature of tailwindcss introduced in March 2021, just by adding `mode: 'jit'` option to the config file.).  



And also `postcss.config.js`.
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

<br />

#### 4. Create `src/styles/tailwind.css`.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

<br />

#### 5. Install storybook.

```sh
yarn add -D @storybook/react @storybook/addon-essentials @storybook/addon-actions
```

<br />

#### 6. add srotybook script in `package.json`

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "storybook": "start-storybook -p 6006"
},
```

<br />

#### 7. Create `.storybook/main.js`

```javascript
module.exports = {
  stories: ["../src/**/*stories.@(js|jsx|ts|tsx)"],
};
```

<br />

#### 8. create `.storybook/preview.js`

```javascript
import "../src/styles/tailwind.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
```

<br />

#### 9. Create sample component `src/component/SampleBox.js`, which uses tailwindcss.

```javascript
import React from "react";

export const SampleBox = ({ children }) => {
  return (
    <div className="flex text-red-400 border-2 w-24 justify-center">
      {children}
    </div>
  );
};
```

<br />

#### 10. Create `src/component/SampleBox.stories.js`, which gives children to Flex component

```javascript
import React from "react";

import { SampleBox } from "./SampleBox";

export default {
  title: "Example/SampleBox",
  component: SampleBox,
};

const Template = (args) => <SampleBox {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "hello",
};
```

<br />

## Bug

At this point, if you execute storybook with `yarn storybook`, it occurs the PostCSS error,

```
Error: PostCSS plugin tailwindcss requires PostCSS 8.
```

even if we have PostCSS in version of 8 in `package.json`.

```json
"devDependencies": {
  "@storybook/addon-actions": "^6.2.9",
  "@storybook/addon-essentials": "^6.2.9",
  "@storybook/addon-links": "^6.2.9",
  "@storybook/node-logger": "^6.2.9",
  "@storybook/preset-create-react-app": "^3.1.7",
  "@storybook/react": "^6.2.9",
  "autoprefixer": "^10.2.5",
  "postcss": "^8.3.0",
  "tailwindcss": "^2.1.2"
}
```

<br />

## Solutions

### Option 1: Easiest and lightest, but not stable

Just install postcss-loader with version 4, and that's it. (postcss-loader with version 5 causes error)

```
yarn add -D postcss-loader@^4.1.0
```

<br />

### Option 2: Using storybook's addon (🌟 Recommended )

Storybook supports PostCSS 8+ with `@storybook/addon-postcss`. Details introduced [here](https://storybook.js.org/addons/@storybook/addon-postcss).

#### 1. Install addon

```
yarn add -D @storybook/addon-postcss
```

#### 2. Edit options in `.storybook/main.js` to use addon

```javascript
module.exports = {
  stories: ["../src/**/*stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
  ],
};
```

<br />

### Option 3: Using PostCSS 7 🥲

You could downgrade PostCSS to version 7, with using `@tailwindcss/postcss7-compat`. Details introduced [here](https://tailwindcss.com/docs/installation#post-css-7-compatibility-build).

```
yarn remove tailwindcss postcss autoprefixer
yarn add -D tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```

<br />

## Use Storybook with Tailwind 2

Now you can use storybook with fully operating tailwind.

```
yarn storybook
```

<img width="1344" alt="image" src="https://user-images.githubusercontent.com/38656148/119147310-6c486580-ba86-11eb-822c-d695dc976ce1.png">
