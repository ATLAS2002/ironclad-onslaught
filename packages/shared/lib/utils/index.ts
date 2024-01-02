import { randomBytes } from "crypto";

/**
 * @description checks for null or undefined values in the arguments array
 * @param args - array of values to be checked
 * @param throwErr - boolean flag to throw error upon encountering empty value
 * @returns if there is a null or undefined value
 */

export const emptyErrorHandler = (
  args: unknown[],
  throwErr: boolean = false
): never | boolean => {
  const emptyExists = args.some(
    (value) => typeof value === "undefined" || value === null
  );
  if (throwErr && emptyExists)
    throw new Error("There are some null or undefined values");
  return emptyExists;
};

/**
 * @param length - length of the desired string @default 10
 * @returns a random 20 character string
 */

export const generateUID = (length: number = 10): string => {
  return randomBytes(length / 2).toString("hex");
};
