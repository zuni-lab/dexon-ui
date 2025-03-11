import classNames from "classnames";
import moment from "moment";

/**
 * Mapping hotkey into className package for better usage
 */
export const cx: typeof classNames = classNames;

export const formatWalletAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

export const getFomattedTimeAndDate = (inputDate: string | number) => {
  const date = moment(inputDate);
  const formattedDate = date.format("HH:mm Do MMM");
  return date.isValid() ? formattedDate : "Never";
};

export const getForrmattedFullDate = (inputDate: string | number) => {
  const date = moment(inputDate).local();
  const formattedDate = date.format("HH:mm MM-DD-YYYY");
  return date.isValid() ? formattedDate : "Never";
};

// HH, DD/MM/YYYY
export const getFormattedDate = (inputDate: string | number) => {
  const date = moment(inputDate);
  const formattedDate = date.format("DD-MM-YYYY");
  return date.isValid() ? formattedDate : "Never";
};

export const getCurrentUnixTime = () => {
  return moment().unix();
};

export const toUtcTime = (date: Date) => {
  const time = new Date(date);
  time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
  return time;
};

// hex
export const isValidBytes = (val: string) => {
  return /^0x([0-9a-fA-F]{2})+$/.test(val);
};

export const isValidBytesWithLength = (val: string, length: number) => {
  return new RegExp(`^0x([0-9a-fA-F]{${length * 2}})$`).test(val);
};

export const isValidAddress = (val: string) => {
  return isValidBytesWithLength(val, 20);
};

const FLOAT_REGEX = /^[+-]?([0-9]*[.])?[0-9]+$/;
export const isValidFloat = (val: string) => {
  return FLOAT_REGEX.test(val);
};

export const formatNumber = (num: number) => {
  if (num === 0) {
    return "0.0";
  }
  const [integer, decimal] = num.toString().split(".");
  const truncatedDecimal = decimal ? decimal.slice(0, 6) : "";
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${truncatedDecimal ? `.${truncatedDecimal}` : ""}`;
};

export const formatReadableUsd = (value: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

export const toQueryString = (params: object) => {
  const toSnakeCase = (str: string) =>
    str.replace(/([A-Z])/g, "_$1").toLowerCase();

  return Object.entries(params)
    .filter(([_, value]) => value !== undefined) // Remove undefined values
    .flatMap(([key, value]) => {
      const snakeKey = toSnakeCase(key);
      if (Array.isArray(value)) {
        return value.map(
          (v) => `${encodeURIComponent(snakeKey)}=${encodeURIComponent(v)}`,
        );
      }
      return `${encodeURIComponent(snakeKey)}=${encodeURIComponent(value)}`;
    })
    .join("&");
};

export function formatTimeInterval(minutes: number): string {
  if (!minutes) return "0 minutes";

  const intervals = [
    { unit: "month", value: 43200 }, // 30 days
    { unit: "week", value: 10080 }, // 7 days
    { unit: "day", value: 1440 }, // 24 hours
    { unit: "hour", value: 60 },
    { unit: "minute", value: 1 },
  ];

  let remaining = minutes;
  const parts: string[] = [];

  for (const { unit, value } of intervals) {
    if (remaining >= value) {
      const count = Math.floor(remaining / value);
      parts.push(`${count} ${unit}${count > 1 ? "s" : ""}`);
      remaining %= value;
    }
  }

  return parts.length > 0 ? parts.join(" ") : "0 minutes";
}
