import { type ISession } from "../types";
import { sign, verify } from "jsonwebtoken";

const SECRET =
  // eslint-disable-next-line turbo/no-undeclared-env-vars, no-undef
  process.env.JWT_SECRET ?? "ag3Z9ce7V6KsKTNvE5G9mpEFXswfIHwutQov3a6C2XU=";

export function generateToken(session: ISession) {
  return sign(session, SECRET);
}

export function decode(token: string): ISession {
  const session = verify(token, SECRET);
  return session as ISession;
}
