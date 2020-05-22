import matchSearch from "./match-search";

describe("matchSearch", () => {
  it("should calculate the correct match for empty values", () => {
    // A non-exact match against no query parameters
    expect(matchSearch(undefined, undefined, false, "")).toEqual({
      isExact: true,
      search: {},
      searchKeyset: [],
    });

    // An exact match against no query parameters
    expect(matchSearch(undefined, undefined, true, "")).toEqual({
      isExact: true,
      search: {},
      searchKeyset: [],
    });

    // An exact match against search string query parameters
    expect(
      matchSearch(undefined, undefined, true, "?foo=bar&fizz=buzz")
    ).toEqual(null);

    // A non-exact match against search string query parameters
    expect(
      matchSearch(undefined, undefined, false, "?foo=bar&fizz=buzz")
    ).toEqual({
      isExact: false,
      search: {
        fizz: "buzz",
        foo: "bar",
      },
      searchKeyset: [],
    });
  });

  it("should calculate the correct match against the supplied search object", () => {
    const search = {
      bling: "blaww",
      burr: "burr",
      fizz: "buzz",
      foo: "bar",
    };
    const queryParams = "?burr=burr&fizz=buzz&bling=blaww&foo=bar";
    // Expect an exact match.
    expect(matchSearch(search, undefined, true, queryParams)).toEqual({
      isExact: true,
      search,
      searchKeyset: [],
    });
    // Expect an exact match even though not specifying exact.
    expect(matchSearch(search, undefined, false, queryParams)).toEqual({
      isExact: true,
      search,
      searchKeyset: [],
    });

    const queryParamsTwo =
      "?camp=flog_gnaw&burr=burr&fizz=buzz&bling=blaww&foo=bar&golf=wang";
    // Expect a non-exact match to pass
    expect(matchSearch(search, undefined, false, queryParamsTwo)).toEqual({
      isExact: false,
      search: {
        ...search,
        camp: "flog_gnaw",
        golf: "wang",
      },
      searchKeyset: [],
    });
    // Expect an exact match to fail
    expect(matchSearch(search, undefined, true, queryParamsTwo)).toEqual(null);

    const queryParamsThree = "?record_label=brainfeeder&artist=teebs";
    // Expect a non-exact match to fail when the query params are missing expected keys.
    expect(matchSearch(search, undefined, false, queryParamsThree)).toEqual(
      null
    );
    // Expect an exact match to fail for the same reason
    expect(matchSearch(search, undefined, true, queryParamsThree)).toEqual(
      null
    );
  });

  it("should calculate the correct match against the supplied search array", () => {
    const queryParams = "?foo=bar&bar=buzz";
    // Expect an exact match to pass when all the keys are there.
    expect(matchSearch(undefined, ["foo", "bar"], true, queryParams)).toEqual({
      isExact: true,
      search: {
        bar: "buzz",
        foo: "bar",
      },
      searchKeyset: ["foo", "bar"],
    });

    // Expect an exact match to pass even with duplicates.
    expect(
      matchSearch(undefined, ["foo", "bar", "foo", "bar"], true, queryParams)
    ).toEqual({
      isExact: true,
      search: {
        bar: "buzz",
        foo: "bar",
      },
      searchKeyset: ["foo", "bar", "foo", "bar"],
    });

    // Expect a an exact match to fail when there are more keys than expected.
    expect(matchSearch(undefined, ["foo"], true, queryParams)).toEqual(null);

    // Expect a non-exact match to pass when the supplied keys (and more) are there.
    expect(matchSearch(undefined, ["bar"], false, queryParams)).toEqual({
      isExact: false,
      search: {
        bar: "buzz",
        foo: "bar",
      },
      searchKeyset: ["bar"],
    });

    // Expect a non-exact match to fail when the supplied keys (and more) are not there.
    expect(
      matchSearch(undefined, ["bar", "bling", "blaww"], false, queryParams)
    ).toEqual(null);
    // Expect an exact match to fail when the supplied keys (and more) are not there.
    expect(
      matchSearch(undefined, ["bar", "bling", "blaww"], true, queryParams)
    ).toEqual(null);
  });
});
