export function getExtension(type: string) {
  if (type === "image/jpeg") {
    return "jpg";
  }
  if (type === "image/png") {
    return "png";
  }
  if (type === "application/pdf") {
    return "pdf";
  }

  throw new Error(`Unsupported file type: ${type}`);
}
