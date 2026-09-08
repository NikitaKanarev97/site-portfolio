/** Load lazy images before checking them; a closed zoom has no source yet. */
export async function verifyImages(page) {
  return page.evaluate(async () => {
    const images = [...document.images].filter((image) =>
      image.getAttribute('src') || image.getAttribute('srcset') ||
      image.closest('picture')?.querySelector('source[srcset]'));
    return (await Promise.all(images.map(async (image) => {
      image.loading = 'eager';
      let timer;
      try {
        await Promise.race([
          image.decode(),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Image load timeout')), 15000); }),
        ]);
        if (image.naturalWidth > 0) return null;
      } catch {
        // A failed decode or timeout is a failure, even if complete is false.
      } finally {
        clearTimeout(timer);
      }
      return image.currentSrc || image.getAttribute('src') || image.getAttribute('srcset') || 'picture source';
    }))).filter(Boolean);
  });
}
