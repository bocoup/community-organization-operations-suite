# NextJS Starter for Genui Resliance Team

## In this project

- [NextJS](https://nextjs.org/docs/getting-started)
  React front end framework for static site generation and routing
- [Redux/toolkit](https://redux-toolkit.js.org/)
  Global app state management
- [Typescript](https://www.typescriptlang.org/)
  Strict typing
- [FluentUI](https://developer.microsoft.com/en-us/fluentui#/controls/web)
  Microsoft components
- [Bootstrap](https://getbootstrap.com/docs/5.0/customize/sass/)
  Utilities and layout styles
- [Plop](https://plopjs.com/)
  Component and redux generators for faster development

### Install dependies

```bash
yarn
```

### Run locally

```bash
yarn dev
```

### Using Templates

This project uses Plop templating to generate

```bash
yarn dev
```

### Build for production

```bash
yarn build
```

### Server production locally

**This must be called AFTER build**

```bash
yarn start
```

## Absolute paths

Root level, and commonly accessed directories have an alias created in `tsconfig.json` for easy access and maintainability. `(e.g. '~types', '~store', '~components')`

`~` was used over `@` to avoid conflicts with `@types` which is used by typescript node modules.

## Component Layout

Components are organized for resuability. Reusable and extend components are grouped together in folders to be easily found.

Each folder has a typescript path created for easy root level access `(e.g. '~layouts/ContainerLayout', '~forms/SignUpForm', '~ui/ActionBar')`

```bash
/ components
	/ layouts - contains layouts for page components
	/ forms - contains forms
	/ modals - contains modals
	/ ui - contains singular components used throughout the app
```

## Component Folders

Components are organized into folders in order to maintain a cleaner code base while leveraging modular Scss.

```bash
/ components
	/ forms
		/ SignUpForm
			index.tsx
			index.modular.scss
```

The above `SignUpForm` component can now be imported as

```js
import SignUpForm from '~forms/SignUpForm'
```

## Templates and Plop generators

Due to the complexity of the component folder structure this project uses Plop templating to
make creating new components and reducers simpler.

```bash
# default command
yarn plop [generator_name] [first_prompt_value] [...prompt_values]

# Create a page
# Creates a react component in the ./pages/ directory
yarn plop page page-name

# Create a component
# Creates a react component and style.module.scss in a folder with the component name
yarn plop component ComponentName
```

## Comments:

We like comments and JSDocs here. It all gets removed at build time anyway.

Use JSDocs comments to talk about your functions and components.

```js
/**
 * General description and helpful information
 *
 * @params {<type>} You can talk abou your inputs using the @params keyword
 * @returns {<returntype>} What does your function return? What kind of component is it?
 * /
```

## TODO:

- Clean up deployment environments
- Clean up bootstrap
- Pull data from the api server
- And much, much, more! 🙌✨🌈

This project uses `TODO:` and `FIXME` comments to keep track outstanding in-term development work.
I recommend using a VSCode extension like [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) to help see them all
