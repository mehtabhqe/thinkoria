export async function fileToBase64(file: File): Promise<string> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  const chunkSize = 0x8000;
  let binary = "";
  for (let offset = 0; offset < buffer.length; offset += chunkSize) {
    binary += String.fromCharCode(...Array.from(buffer.subarray(offset, Math.min(offset + chunkSize, buffer.length))));
  }
  return btoa(binary);
}
