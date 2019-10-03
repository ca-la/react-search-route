import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { SearchRouteProps } from './search-route';
import matchSearch from './match-search';

interface OwnProps {
  children?: JSX.Element | JSX.Element[];
}

function SearchSwitch(
  props: OwnProps & RouteComponentProps<{}>
): JSX.Element | null {
  if (!props.children) {
    return null;
  }

  let element: JSX.Element | null = null;
  let doesMatch = false;

  // We use React.Children.forEach instead of React.Children.toArray().find()
  // here because toArray adds keys to all child elements and we do not want
  // to trigger an unmount/remount for two <Route>s that render the same
  // component at different URLs.
  React.Children.forEach(props.children, (child: JSX.Element) => {
    if (!doesMatch && React.isValidElement<SearchRouteProps>(child)) {
      element = child;

      doesMatch = Boolean(
        matchSearch(
          child.props.search,
          child.props.searchKeyset,
          Boolean(child.props.exact),
          props.location.search
        )
      );
    }
  });

  return doesMatch && element ? element : null;
}

export default withRouter(SearchSwitch);
