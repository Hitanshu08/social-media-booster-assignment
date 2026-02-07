import * as React from 'react';

type BrandImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function BrandImage({ fallbackSrc, onError, ...props }: BrandImageProps) {
  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallbackSrc && event.currentTarget.src !== fallbackSrc) {
      event.currentTarget.src = fallbackSrc;
    }
    onError?.(event);
  };

  return <img {...props} onError={handleError} />;
}
