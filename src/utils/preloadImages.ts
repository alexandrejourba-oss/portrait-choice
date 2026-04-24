export function preloadImages(srcList: string[]): Promise<void> {
  return Promise.all(
    srcList.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  ).then(() => {});
}
