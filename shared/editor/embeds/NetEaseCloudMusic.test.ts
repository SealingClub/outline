import NetEaseCloudMusic from "./NetEaseCloudMusic";

describe("Bilibili", () => {
  const match = NetEaseCloudMusic.ENABLED[0];

  test("to be enabled on video link", () => {
    expect(
      "https://music.163.com/song?id=1308778268&".match(match)
    ).toBeTruthy();
  });

  test("to not be enabled elsewhere", () => {
    expect("https://youtu.be".match(match)).toBe(null);
    expect("https://bilibili.com".match(match)).toBe(null);
    expect("https://www.bilibili.com".match(match)).toBe(null);
    expect("https://www.bilibili.com/logout".match(match)).toBe(null);
    expect("https://www.bilibili.com/feed/subscriptions".match(match)).toBe(
      null
    );
  });
});
