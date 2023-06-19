const fileMagicNumbers = {
  gif: '47494638',
  jpg: ['ffd8ffdb', 'ffd8ffe0', 'ffd8ffee', 'ffd8ffe1'],
  png: '89504e47',
  tif: '4d4d002a',
  zip: '504b0304',
  mp4: ['0001866747970', '0002066747970'],
  avi: '52494646',
  ogg: '4f676753',
  webm: '1a45dfa3',
};
export default function fileType(buffer) {
  const bytes = new Uint8Array(buffer).subarray(0, 8);
  let hex = '';

  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16);
  }

  for (const [key, value] of Object.entries(fileMagicNumbers)) {
    if (typeof value === 'string') {
      if (hex.startsWith(value)) {
        console.log({ hex, type: key });
        return key;
      }
    } else {
      if (value.some(v => hex.startsWith(v))) {
        console.log({ hex, type: key });
        return key;
      }
    }
  }
  console.log({ hex, type: undefined });
  return undefined;
}
