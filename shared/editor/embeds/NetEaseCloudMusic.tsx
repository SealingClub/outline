import * as React from "react";
import Frame from "../components/Frame";
import { EmbedProps as Props } from ".";

const URL_REGEX =
  /(?:https?:\/\/)?(music\.163\.com)(\/|\/#\/)song\?id=([0-9]+)[\S]?/gi;
// https://music.163.com/song?id=1308778268&

export default function NetEaseCloudMusic(props: Props) {
  const { matches } = props.attrs;
  const musicId: string = matches[0];
  return (
    <Frame
      {...props}
      src={`https://music.163.com/outchain/player?type=2&id=${musicId}&auto=0&height=66`}
      title={`NetEaseCloudMusic Embed (${musicId})`}
      frameBorder="no"
      marginWidth="0"
      marginHeight="0"
      width="80%"
      height="86"
    />
  );
}

NetEaseCloudMusic.ENABLED = [URL_REGEX];
