import fileType from './fileType';

export default function fileUpload(config) {
  const { file, onSuccess, socket, supportTypes } = config;

  return new Promise((resolve, reject) => {
    const readerBuffer = new FileReader();
    const readerBase64 = new FileReader();
    const segmentSize = 512 * 1024; // 分段上傳，每段512kb
    const totalSegments = Math.ceil(file.size / segmentSize);
    let currentSegment = 0;
    const readNextSegment = () => {
      const start = currentSegment * segmentSize;
      const end = Math.min(start + segmentSize, file.size);
      const fileSegment = file.slice(start, end);
      readerBase64.readAsDataURL(fileSegment);
    };

    readerBuffer.onload = e => {
      const filetype = fileType(e.target.result);
      if (supportTypes.includes(filetype)) {
        readNextSegment();
      } else {
        reject(`${file.name} is invalid.`);
      }
    };
    readerBase64.onload = e => {
      const fileContent = e.target.result;

      currentSegment++;
      socket.emit('fileUpload', {
        fileName: file.name,
        fileContent,
        currentSegment,
        totalSegments,
      });
      if (currentSegment === totalSegments) {
        onSuccess(resolve, socket);
      } else {
        readNextSegment();
      }
    };
    readerBase64.onerror = () => {
      socket.emit('uploadResult', {
        success: false,
        message: `Something wrong on ${file.name}`,
      });
    };
    readerBuffer.readAsArrayBuffer(file);
  });
}
