import * as React from "react";
import styled from "styled-components";
import Frame from "../components/Frame";
import { EmbedProps as Props } from ".";

const WYMusicFrame = styled(Frame)`
  border-radius: 13px;
`;

export default function NetEaseCloudMusic({ matches, ...props }: Props) {
  const musicId: string = matches[0];
  const isDarkTheme =
    window.localStorage && window.localStorage.getItem("theme") === '"dark"';
  return (
    <WYMusicFrame
      {...props}
      src={`https://music.163.com/outchain/player?type=2&id=${musicId}&auto=0&height=66${
        isDarkTheme ? "&bg=111319" : ""
      }`}
      title={`NetEaseCloudMusic Embed (${musicId})`}
      frameBorder="no"
      marginWidth="0"
      marginHeight="0"
      width="100%"
      height="86"
    />
  );
}
