import {
  PDF_IMAGE_MESSAGE,
  PDF_INVALID_MESSAGE,
  PDF_OFFICE_MESSAGE,
  PDF_TOO_LARGE_MESSAGE,
} from './adminErrors';

export const MAX_PDF_BYTES = 10 * 1024 * 1024;

const OFFICE_EXT = /\.(docx?|xlsx?|pptx?|odt|rtf)$/i;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|heic|tiff?|bmp)$/i;
const OFFICE_MIME = /word|excel|powerpoint|officedocument|msword|spreadsheet|presentation|opendocument|rtf/i;

function readAscii(bytes: Uint8Array): string {
  return String.fromCharCode(...bytes);
}

export async function validateCartaPdf(file: File): Promise<string | null> {
  const name = file.name || '';

  if (file.size > MAX_PDF_BYTES) return PDF_TOO_LARGE_MESSAGE;
  if (file.size < 5) return PDF_INVALID_MESSAGE;

  if (OFFICE_EXT.test(name) || OFFICE_MIME.test(file.type || '')) {
    return PDF_OFFICE_MESSAGE;
  }
  if (IMAGE_EXT.test(name) || (file.type || '').startsWith('image/')) {
    return PDF_IMAGE_MESSAGE;
  }

  const looksLikePdfName = /\.pdf$/i.test(name);
  const looksLikePdfMime =
    file.type === 'application/pdf' ||
    file.type === 'application/octet-stream' ||
    file.type === '';
  if (!looksLikePdfName && !looksLikePdfMime) {
    return PDF_INVALID_MESSAGE;
  }

  try {
    const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    if (readAscii(header) !== '%PDF-') {
      return PDF_INVALID_MESSAGE;
    }
  } catch {
    return PDF_INVALID_MESSAGE;
  }

  return null;
}
