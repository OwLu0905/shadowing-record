export enum ShadowingType {
  YouTube,
  File,
}

export const ShadowingTypeMap: Record<string, ShadowingType> = {
  YouTube: ShadowingType.YouTube,
  File: ShadowingType.File,
};

export type ShadowingString = "YouTube" | "File";
