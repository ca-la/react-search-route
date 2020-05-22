import * as React from "react";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import SearchRoute from "./index";
import SearchSwitch from "./switch";

describe("<SearchRoute />", () => {
  afterEach(cleanup);

  const exactMatch = (): JSX.Element => <div>Matched</div>;
  const noMatch = (): JSX.Element => <div>Do not match me</div>;
  const partialMatch = (): JSX.Element => <div>Partial match</div>;

  it("will render nothing if there is no match", () => {
    const searchComponent = render(
      <MemoryRouter initialEntries={["/?isFoo=true"]}>
        <SearchRoute
          exact
          search={{ isFoo: "true", doesBar: "true" }}
          render={noMatch}
        />
      </MemoryRouter>
    );

    expect(() => searchComponent.getByText("Do not match me")).toThrowError();
  });

  it("will render only the first matching route when wrapped in <SearchSwitch />", () => {
    const searchComponent = render(
      <MemoryRouter initialEntries={["/?isFoo=true"]}>
        <SearchSwitch>
          <SearchRoute exact search={{ isFoo: "true" }} render={exactMatch} />
          <SearchRoute
            search={{ isFoo: "true", doesBar: "true" }}
            render={partialMatch}
          />
          <SearchRoute
            exact
            search={{ isFoo: "true", doesBar: "true" }}
            render={noMatch}
          />
        </SearchSwitch>
      </MemoryRouter>
    );

    expect(searchComponent.getByText("Matched")).toBeTruthy();
    expect(() => searchComponent.getByText("Do not match me")).toThrowError();
    expect(() => searchComponent.getByText("Partial match")).toThrowError();
  });

  it("will render all matching routes when there is no <SearchSwitch />", () => {
    const searchComponent = render(
      <MemoryRouter initialEntries={["/?isFoo=true"]}>
        <React.Fragment>
          <SearchRoute exact search={{ isFoo: "true" }} render={exactMatch} />
          <SearchRoute
            search={{ isFoo: "true", doesBar: "true" }}
            render={partialMatch}
          />
          <SearchRoute
            exact
            search={{ isFoo: "true", doesBar: "true" }}
            render={noMatch}
          />
        </React.Fragment>
      </MemoryRouter>
    );

    expect(searchComponent.getByText("Matched")).toBeTruthy();
    expect(searchComponent.getByText("Partial match")).toBeTruthy();
    expect(() => searchComponent.getByText("Do not match me")).toThrowError();
  });
});
