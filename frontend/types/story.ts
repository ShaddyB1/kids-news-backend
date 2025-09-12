export interface Story {
  title: string;
  category: string;
  content: string;
  videoSource: any; // TODO: Type this properly with actual video asset type
  videoDescription: string;
}

export interface ArchivedStory {
  title: string;
  category: string;
}

export interface ArchivedWeek {
  weekOf: string;
  stories: ArchivedStory[];
}
