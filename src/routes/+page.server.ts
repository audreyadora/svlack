import channels from "../data/channels.json";
import type { ChannelJSON } from "../types/types";

export const channelData: ChannelJSON = channels as ChannelJSON;

export const load = (() => {
  return {
    channelData
  };
})