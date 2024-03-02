import * as React from "react";
import styled, { useTheme } from "styled-components";
import Frame from "../components/Frame";
import { EmbedProps as Props } from ".";

const WYMusicFrame = styled(Frame)`
  border-radius: 13px;
`;

export default function NetEaseCloudMusic({ matches, ...props }: Props) {
  const musicId: string = matches[0];
  const theme = useTheme();
  return (
    <WYMusicFrame
      {...props}
      src={`https://music.163.com/outchain/player?type=2&id=${musicId}&auto=0&height=66&bg=${theme.background.slice(1)}`}
      title={`NetEaseCloudMusic Embed (${musicId})`}
      frameBorder="no"
      marginWidth="0"
      marginHeight="0"
      width="100%"
      height="86"
    />
  );
}
