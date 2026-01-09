export const encodeCursor = (payload: object) =>
  Buffer.from(JSON.stringify(payload)).toString("base64");

export const decodeCursor = (cursor: string) =>
  JSON.parse(Buffer.from(cursor, "base64").toString());