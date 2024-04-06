import { InferSelectModel } from "drizzle-orm";
import { audios, records } from "./schema";

export type RecordItem = InferSelectModel<typeof records>;

export type AudioItem = InferSelectModel<typeof audios>;
