import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import matchSearch, { SearchMatchParams } from './match-search';

export type WithSearchMatch = RouteComponentProps<any> & {
  searchMatch: SearchMatchParams;
};

type RouteRenderer = (routeProps: WithSearchMatch) => React.ReactNode;

export interface SearchParams {
  [key: string]: string | null | undefined;
}

export type SearchKeyset = string[];

export interface SearchRouteProps {
  searchKeyset?: SearchKeyset;
  search?: SearchParams;
  exact?: boolean;
  path?: string;
  render?: RouteRenderer;
}

function maybeRender(
  search: SearchParams | undefined,
  searchKeyset: SearchKeyset = [],
  exact: boolean,
  render: RouteRenderer | undefined,
  routeProps: RouteComponentProps<any>
): React.ReactNode {
  if (!render) {
    return null;
  }

  const searchMatch = matchSearch(
    search,
    searchKeyset,
    exact,
    routeProps.location.search
  );

  return (
    searchMatch &&
    render({
      ...routeProps,
      searchMatch
    })
  );
}

export default function SearchRoute(props: SearchRouteProps): JSX.Element {
  if (props.render) {
    return (
      <Route
        path={props.path || '/'}
        render={maybeRender.bind(
          null,
          props.search,
          props.searchKeyset,
          Boolean(props.exact),
          props.render
        )}
      />
    );
  }
  throw new Error('A render prop must be passed through!');
}
