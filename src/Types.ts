export interface BboxCoords {
  lat: number;
  lon: number;
}

export interface BboxDataType {
  sw: BboxCoords;
  ne: BboxCoords;
}

export interface MpiDataTypeNational {
  country: string;
  iso_a3: string;
  bbox: BboxDataType;
}

export interface TooltipData {
  subregion: string;
  country: string;
  year?: string;
  values: object;
  xPosition: number;
  yPosition: number;
}
