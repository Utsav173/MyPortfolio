export interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

export type Toc = TocEntry[];
