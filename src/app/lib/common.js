
import Image from 'next/image';

export function toUTF16BE(str) {
  const utf16le = Buffer.from(str, 'utf16le'); // Node only supports utf16le
  const utf16be = Buffer.alloc(utf16le.length);

  // Swap every pair of bytes to convert to BE
  for (let i = 0; i < utf16le.length; i += 2) {
    utf16be[i] = utf16le[i + 1];
    utf16be[i + 1] = utf16le[i];
  }

  return utf16be;
}

export function fromUTF16BE(buffer) {
  const utf16le = Buffer.alloc(buffer.length);

  // Swap every pair of bytes to convert to LE
  for (let i = 0; i < buffer.length; i += 2) {
    utf16le[i] = buffer[i + 1];
    utf16le[i + 1] = buffer[i];
  }

  return utf16le.toString('utf16le');
}


export const fix = `
<mosID>${process.env.MOS_ID}</mosID>
<ncsID>${process.env.MOS_DEVICE_ID}</ncsID>
<messageID>30334</messageID>`;

export const mosStart = `<mos>`

export const mos = `</mos>`

export const compressed = (pretty) => {
  if (!pretty) return '';
  return pretty
    .replace(/\s*\n\s*/g, '')
    .replace(/>\s+</g, '><')
    .trim();
};


export const getFormattedDatetimeNumber = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
};

export const addressmysql = () => {

  return "/api/nrcs";

};


export const templateLayers = {

}

export function LoadingModal() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Image
        src="/loader.gif" // assumes loader.gif is in public/
        alt="Loading..."
        width={100}
        height={100}
      />
    </div>
  );
}