const baseUrl = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/';
const assetBase = `${baseUrl}assets`;
const buildAsset = (filename: string) => `${assetBase}/${filename}`;

export const brandAssets = {
  logo: {
    src: buildAsset("7ZviI998tvmnzabssH15S9Hc.png"),
    fallbackSrc: buildAsset("7ZviI998tvmnzabssH15S9Hc.png"),
  },
  dashboardIcon: {
    src: buildAsset("KYNn75YK8fG2lpgQh1ci1voGSWs.png"),
    fallbackSrc: buildAsset("KYNn75YK8fG2lpgQh1ci1voGSWs.png"),
  },
  searchIcon: {
    src: buildAsset("YZMsuOgJQUkrcHAV7HunQZTIk.png"),
    fallbackSrc: buildAsset("YZMsuOgJQUkrcHAV7HunQZTIk.png"),
  },
  emptyStateIcon: {
    src: buildAsset("0dyyM325eCiaagkU8KOSTqAxDQ.png"),
    fallbackSrc: buildAsset("0dyyM325eCiaagkU8KOSTqAxDQ.png"),
  },
};
