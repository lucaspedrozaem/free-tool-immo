export function extractDominantColor(imgSrc: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      const { data } = ctx.getImageData(0, 0, 50, 50);

      const counts: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
        if (a < 128) continue;
        if (r > 230 && g > 230 && b > 230) continue;
        if (r < 25 && g < 25 && b < 25) continue;
        const key = `${r & 0xf0},${g & 0xf0},${b & 0xf0}`;
        counts[key] = (counts[key] || 0) + 1;
      }

      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (top) {
        const [r, g, b] = top[0].split(",").map(Number);
        const hex = `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
        resolve(hex);
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imgSrc;
  });
}
