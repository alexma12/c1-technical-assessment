const getAccumulatedDollarsMap = require("../getAccumulatedDollarsMap");

let validTestTransactionObject = {
  T01: {
    date: "2021-05-01",
    merchant_code: "sportcheck",
    amount_cents: 21000,
  },
  T02: {
    date: "2021-05-02",
    merchant_code: "sportcheck",
    amount_cents: 8700,
  },
};

let negativeCentsTransactionObject = {
  T01: {
    date: "2021-05-01",
    merchant_code: "sportcheck",
    amount_cents: -1,
  },
};

let differentMonthTransactionObject = {
  T01: {
    date: "2021-11-01",
    merchant_code: "sportcheck",
    amount_cents: 21000,
  },

  T02: {
    date: "2021-05-02",
    merchant_code: "sportcheck",
    amount_cents: 8753,
  },
  T03: {
    date: "2021-5-02",
    merchant_code: "tim_hortons",
    amount_cents: 323,
  },
  T04: {
    date: "2021-05-02",
    merchant_code: "subway",
    amount_cents: 47,
  },
};

let improperTransactionKeyFormattingObject = {
  T01: {
    date: "2021-05-01",
    merchant_code: "sportcheck",
    amount_cents: 21000,
  },

  T02: {
    date: "2021-05-02",
    merchantCode: "sportcheck",
    amount_cents: 8753,
  },
  T03: {
    date: "2021-05-02",
    merchant_code: "tim_hortons",
    amountCents: 323,
  },
  T04: {
    dateString: "2021-05-02",
    merchant_code: "subway",
    amount_cents: 47,
  },
  T05: {
    date: "05-02-2021",
    merchant_code: "subway",
    amount_cents: 47,
  },
  T06: {
    date: "05/02/2021",
    merchant_code: "subway",
    amount_cents: 47,
  },
};

let improperTransactionKeyFormattingObject2 = {
  T02: {
    date: "2021-05-02",
    merchantCode: "sportcheck",
    amount_cents: 8753,
  },
  T03: {
    date: "2021-05-02",
    merchant_code: "tim_hortons",
    amountCents: 323,
  },
  T04: {
    dateString: "2021-05-02",
    merchant_code: "subway",
    amount_cents: 47,
  },
};

let nonObjectTransaction = {
  T01: null,
  T02: "",
  T03: 1,
  T03: undefined,
};

describe("empty cases and invalid input tests", () => {
  it("should return an null when passed in an empty object", () => {
    const result = getAccumulatedDollarsMap({}, "01");
    expect(result).toBeNull();
  });

  it("should return an null when passed in an invlid month", () => {
    const result = getAccumulatedDollarsMap(validTestTransactionObject, "13");
    expect(result).toBeNull();
  });

  it("should return an null when passed in an invlid month", () => {
    const result = getAccumulatedDollarsMap(validTestTransactionObject, "1");
    expect(result).toBeNull();
  });
});

describe("valid input tests", () => {
  it("should not add amount_cents with unmatched month", () => {
    const result = getAccumulatedDollarsMap(
      differentMonthTransactionObject,
      "05"
    );
    expect(result["sportcheck"]).toBe(87.53);
    expect(result["subway"]).toBe(0.47);
    expect(result["TOTAL_SPENT"]).toBe(88);
  });

  it("should not add amount_cents with unmatched month", () => {
    const result = getAccumulatedDollarsMap(
      differentMonthTransactionObject,
      "06"
    );
    expect(result["TOTAL_SPENT"]).toBe(0);
  });

  it("should only add amount_cents with proper object key formatting", () => {
    const result = getAccumulatedDollarsMap(
      improperTransactionKeyFormattingObject,
      "05"
    );
    expect(result["subway"]).toBeUndefined();
    expect(result["tim_hortons"]).toBeUndefined();
    expect(result["sportcheck"]).toBe(210);
    expect(result["TOTAL_SPENT"]).toBe(210);
  });

  it("should not add any amount_cents", () => {
    const result = getAccumulatedDollarsMap(
      improperTransactionKeyFormattingObject2,
      "05"
    );
    expect(result["subway"]).toBeUndefined();
    expect(result["tim_hortons"]).toBeUndefined();
    expect(result["sportcheck"]).toBeUndefined();
    expect(result["TOTAL_SPENT"]).toBe(0);
  });

  it("should skip non object transactions", () => {
    const result = getAccumulatedDollarsMap(nonObjectTransaction, "05");
    expect(result["TOTAL_SPENT"]).toBe(0);
  });

  it("should skip negative cents transactions", () => {
    const result = getAccumulatedDollarsMap(
      negativeCentsTransactionObject,
      "05"
    );
    expect(result["sportcheck"]).toBeUndefined();
    expect(result["TOTAL_SPENT"]).toBe(0);
  });
});
