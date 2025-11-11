export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title:string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets: {
         uri: string;
         title: string;
      }[];
    };
  };
}

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  sources?: GroundingChunk[];
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}
