import { usePathname } from "next/navigation";
import { emptyErrorHandler, generateUID } from "@repo/shared/utils";
import type { ISession, FN } from "@repo/shared";

export const useRoomID = (): string => {
  const path = usePathname();
  const roomId = path.split("/")[1];
  return roomId as string;
};

export const useLocalStorage = <T = unknown>(
  key: string,
  setValue: FN<T, T | undefined>,
  { refresh }: { refresh: boolean } = { refresh: false }
): T => {
  const value = localStorage.getItem(key);
  if (!refresh && !emptyErrorHandler([value])) {
    return JSON.parse(value as string) satisfies T;
  }
  const newValue = setValue(value ? JSON.parse(value) : undefined);
  localStorage.setItem(key, JSON.stringify(newValue));
  return newValue;
};

const generateDefaultSession = (): ISession => {
  const id = generateUID();
  const name = `Player #${id}`;
  return { id, name };
};

export const useClientSession = (
  getSession = generateDefaultSession
): ISession => {
  // const session = useLocalStorage<ISession>("session", getSession);
  const session = generateDefaultSession();
  return session;
};
