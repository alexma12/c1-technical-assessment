/**
 *
 * @param {object} transactions : object containing all transactions
 * @param {string} month : a string repesenting a month from 01 - 12
 * @return {object} an object which maps merchant_code to total dollars spent on that mercharnt code and maps TOTAL_SPENT to total dollars spent
 */

const possibleMonthString = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const getAccumulatedDollarsMap = (transactions, month) => {
  if (
    Object.keys(transactions).length === 0 ||
    !possibleMonthString.includes(month)
  ) {
    return null;
  }
  const transactionMapOutput = {};
  let total_dollars = 0;

  for (let transactionKey in transactions) {
    let currTransaction = transactions[transactionKey];
    if (!isObject(currTransaction)) continue;
    let dateOfTransaction = currTransaction["date"] || null;
    let merchant_code = currTransaction["merchant_code"] || null;
    let amount_dollars =
      currTransaction["amount_cents"] !== undefined
        ? currTransaction["amount_cents"] / 100
        : null;

    if (
      !shouldSkipTransaction(
        dateOfTransaction,
        merchant_code,
        amount_dollars,
        month
      )
    ) {
      incrementTransactionMap(
        transactionMapOutput,
        merchant_code,
        amount_dollars
      );

      total_dollars += amount_dollars;
    }
  }
  transactionMapOutput["TOTAL_SPENT"] = total_dollars;
  return transactionMapOutput;
};

const shouldSkipTransaction = (
  dateOfTransaction,
  merchant_code,
  amount_dollars,
  month
) => {
  return (
    dateOfTransaction === null ||
    merchant_code === null ||
    amount_dollars === null ||
    amount_dollars < 0 ||
    dateOfTransaction.split("-").length !== 3 ||
    dateOfTransaction.split("-")[1] !== month
  );
};

const incrementTransactionMap = (
  transactionMapOutput,
  merchant_code,
  amount_dollars
) => {
  if (transactionMapOutput[merchant_code] !== undefined) {
    transactionMapOutput[merchant_code] =
      transactionMapOutput[merchant_code] + amount_dollars;
  } else {
    transactionMapOutput[merchant_code] = amount_dollars;
  }
};

const isObject = (valToCheck) => {
  return typeof valToCheck === "object" && valToCheck !== null;
};

module.exports = getAccumulatedDollarsMap;
