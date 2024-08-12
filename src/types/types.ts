export interface Channel {
    id: string,
    name: string,
    created: string,
    creator: string,
    is_archived: boolean,
    is_general: boolean,
    members: string[],
    topic: {
      value: string,
      creator: string,
      last_set: string
    },
    purpose: {
      value: string,
      creator: string,
      last_set: string
    }
};
export type ChannelJSON = Channel[];

export type CurrentChannel = {
    id: string,
    name: string,
    topic: string,
    purpose: string
}
