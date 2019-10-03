# React Search Route

This library provides the ability to render children based off the existence of what resides in a [querystring](https://developer.mozilla.org/en-US/docs/Web/API/URL/search). Out of the box, [react-router-dom](https://github.com/ReactTraining/react-router) does not support routing via query parameters for a [plethora of reasons](https://github.com/ReactTraining/react-router/issues/4410#issuecomment-276400992). So we decided to form an opinion and encapsulate querystring routing logic ourselves.

## Status

| Branch   | URL                                                    | Build Status                                                                                                                                            |
| -------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `master` | https://www.npmjs.com/package/@cala/react-search-route | [![CircleCI](https://circleci.com/gh/ca-la/react-search-route/tree/master.svg?style=svg)](https://circleci.com/gh/ca-la/react-search-route/tree/master) |

## Installation

`npm install @cala/react-search-route --save`

## Usage

Import components individually.

```js
import SearchRoute, { SearchSwitch } from '@cala/react-search-route';
```

Or wrap it into a single statement.

```js
import * as ReactSearchRoute from '@cala/react-search-route';
```

From there, you can use `<SearchSwitch />` and `<SearchRoute />` in effectively the same way as
`<Switch />` and `<Route />` from `react-router-dom`. You'll also need to ensure that all route
components are wrapped by a parent `<BrowserRouter />` from `react-router-dom`.

```jsx
const exactMatch = (): JSX.Element => <div>Matched</div>;
const noMatch = (): JSX.Element => <div>Do not match me</div>;
const partialMatch = (): JSX.Element => <div>Partial match</div>;

// ...

<BrowserRouter>
  <SearchSwitch>
    <SearchRoute exact search={{ isFoo: 'true' }} render={exactMatch} />
    <SearchRoute
      search={{ isFoo: 'true', doesBar: 'true' }}
      render={partialMatch}
    />
    <SearchRoute
      exact
      search={{ isFoo: 'true', doesBar: 'true' }}
      render={noMatch}
    />
  </SearchSwitch>
</BrowserRouter>;
```

For more examples, see the tests written in [src/spec.tsx](src/spec.tsx).

## Contributing

To tag off and release a new version to npm, run the release script:

```
$ ./bin/release patch    # 0.0.x - bug fixes
$ ./bin/release minor    # 0.x.0 - new features or changes
$ ./bin/release major    # x.0.0 - large, backwards-incompatible changes
```
