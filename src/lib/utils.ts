import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateOptions<T extends z.ZodTypeAny>(
  config: unknown,
  validator: T
): z.infer<T> {
  const result = validator.safeParse(config);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return result.data;
}
