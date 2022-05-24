export function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

export function downloadJson(objectToSerialize: unknown, fileName: string) {
  const jsonString = JSON.stringify(objectToSerialize);

  const dataUrl =
    "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);

  downloadDataUrl(dataUrl, fileName);
}
