const assetBase = `${import.meta.env.BASE_URL}assets`;

const sampleFallbacks = {
  logo: new URL(
    "../../.sample/7ZviI998tvmnzabssH15S9Hc.png",
    import.meta.url,
  ).href,
  dashboardIcon: new URL(
    "../../.sample/KYNn75YK8fG2lpgQh1ci1voGSWs.png",
    import.meta.url,
  ).href,
  searchIcon: new URL(
    "../../.sample/YZMsuOgJQUkrcHAV7HunQZTIk.png",
    import.meta.url,
  ).href,
  emptyStateIcon: new URL(
    "../../.sample/0dyyM325eCiaagkU8KOSTqAxDQ.png",
    import.meta.url,
  ).href,
};

export const brandAssets = {
  logo: {
    src: `${assetBase}/7ZviI998tvmnzabssH15S9Hc.png`,
    fallbackSrc: sampleFallbacks.logo,
  },
  dashboardIcon: {
    src: `${assetBase}/KYNn75YK8fG2lpgQh1ci1voGSWs.png`,
    fallbackSrc: sampleFallbacks.dashboardIcon,
  },
  searchIcon: {
    src: `${assetBase}/YZMsuOgJQUkrcHAV7HunQZTIk.png`,
    fallbackSrc: sampleFallbacks.searchIcon,
  },
  emptyStateIcon: {
    src: `${assetBase}/0dyyM325eCiaagkU8KOSTqAxDQ.png`,
    fallbackSrc: sampleFallbacks.emptyStateIcon,
  },
};
