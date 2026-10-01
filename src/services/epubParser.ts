import JSZip from 'jszip';
import { Book, Chapter, BookCategory, CoverTheme } from '../types/book';

export async function parseEpubFile(file: File): Promise<Omit<Book, 'id' | 'dateAdded'>> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  // 1. Find container.xml
  const containerXmlFile = zip.file('META-INF/container.xml');
  if (!containerXmlFile) {
    throw new Error('Berkas EPUB tidak valid: META-INF/container.xml tidak ditemukan.');
  }

  const containerXmlText = await containerXmlFile.async('text');
  const domParser = new DOMParser();
  const containerDoc = domParser.parseFromString(containerXmlText, 'application/xml');
  const rootfileEl = containerDoc.querySelector('rootfile');
  const opfPath = rootfileEl?.getAttribute('full-path');

  if (!opfPath) {
    throw new Error('Berkas EPUB tidak valid: Jalur OPF tidak ditemukan di container.xml.');
  }

  // 2. Read OPF
  const opfFile = zip.file(opfPath);
  if (!opfFile) {
    throw new Error(`Berkas OPF tidak ditemukan pada lokasi: ${opfPath}`);
  }

  const opfText = await opfFile.async('text');
  const opfDoc = domParser.parseFromString(opfText, 'application/xml');

  // Extract Metadata
  const titleEl = opfDoc.querySelector('title') || opfDoc.querySelector('dc\\:title');
  const creatorEl = opfDoc.querySelector('creator') || opfDoc.querySelector('dc\\:creator');
  const descEl = opfDoc.querySelector('description') || opfDoc.querySelector('dc\\:description');

  const title = titleEl?.textContent?.trim() || file.name.replace(/\.epub$/i, '');
  const author = creatorEl?.textContent?.trim() || 'Penulis Tidak Dikenal';
  const description = descEl?.textContent?.trim() || 'Ebook berformat EPUB yang diimpor ke Pustaka Digital.';

  // Determine base folder of OPF
  const opfDir = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';

  // 3. Manifest items
  const manifestItems = new Map<string, { href: string; mediaType: string }>();
  opfDoc.querySelectorAll('manifest > item').forEach((item) => {
    const id = item.getAttribute('id');
    const href = item.getAttribute('href');
    const mediaType = item.getAttribute('media-type') || '';
    if (id && href) {
      manifestItems.set(id, { href, mediaType });
    }
  });

  // Try extracting cover image
  let coverUrl: string | undefined = undefined;
  const coverMeta = opfDoc.querySelector('meta[name="cover"]');
  const coverId = coverMeta?.getAttribute('content') || 'cover' || 'cover-image';

  let coverHref = manifestItems.get(coverId)?.href;
  if (!coverHref) {
    // Search manifest for any image with "cover" in id or href
    for (const [id, val] of manifestItems.entries()) {
      if ((id.toLowerCase().includes('cover') || val.href.toLowerCase().includes('cover')) && val.mediaType.startsWith('image/')) {
        coverHref = val.href;
        break;
      }
    }
  }

  if (coverHref) {
    const fullCoverPath = resolveRelativePath(opfDir, coverHref);
    const coverZipFile = zip.file(fullCoverPath);
    if (coverZipFile) {
      try {
        const coverBase64 = await coverZipFile.async('base64');
        const ext = coverHref.split('.').pop()?.toLowerCase() || 'jpeg';
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
        coverUrl = `data:${mime};base64,${coverBase64}`;
      } catch (e) {
        console.warn('Gagal mengekstrak sampul buku:', e);
      }
    }
  }

  // 4. Spine items (reading order)
  const spineItemRefs: string[] = [];
  opfDoc.querySelectorAll('spine > itemref').forEach((itemref) => {
    const idref = itemref.getAttribute('idref');
    if (idref) {
      spineItemRefs.push(idref);
    }
  });

  // Extract chapters content
  const chapters: Chapter[] = [];
  let totalWordCount = 0;

  for (let i = 0; i < spineItemRefs.length; i++) {
    const idref = spineItemRefs[i];
    const manifestItem = manifestItems.get(idref);
    if (!manifestItem) continue;

    const fullChapterPath = resolveRelativePath(opfDir, manifestItem.href);
    const chapterFile = zip.file(fullChapterPath);
    if (!chapterFile) continue;

    try {
      const chapterHtml = await chapterFile.async('text');
      const chapterDoc = domParser.parseFromString(chapterHtml, 'text/html');

      // Remove scripts, styles, forms, iframes
      chapterDoc.querySelectorAll('script, style, form, iframe, link').forEach((el) => el.remove());

      // Extract title from heading or doc title
      const heading = chapterDoc.querySelector('h1, h2, h3, title')?.textContent?.trim();
      const chapterTitle = heading || `Bab ${chapters.length + 1}`;

      // Clean text content (paragraphs)
      const paragraphs: string[] = [];
      const pElements = chapterDoc.querySelectorAll('p, div, blockquote, li');

      if (pElements.length > 0) {
        pElements.forEach((p) => {
          const text = p.textContent?.trim();
          if (text && text.length > 0 && !paragraphs.includes(text)) {
            paragraphs.push(text);
          }
        });
      }

      let content = paragraphs.join('\n\n');
      if (!content || content.length < 50) {
        // Fallback to body text
        content = chapterDoc.body?.textContent?.replace(/\s+/g, ' ').trim() || '';
      }

      if (content.length > 30) {
        const words = content.split(/\s+/).filter(Boolean).length;
        totalWordCount += words;

        chapters.push({
          id: `chap-${i}-${Date.now()}`,
          title: chapterTitle,
          content: content,
          wordCount: words,
        });
      }
    } catch (e) {
      console.warn(`Gagal memproses bab ${manifestItem.href}:`, e);
    }
  }

  // Fallback if no spine chapters could be read
  if (chapters.length === 0) {
    chapters.push({
      id: `chap-fallback-${Date.now()}`,
      title: 'Bab Pembuka',
      content: 'Isi bab tidak dapat diekstrak secara otomatis dari berkas EPUB ini.',
      wordCount: 10,
    });
  }

  // Auto assign category from title/tags
  const category = guessCategory(title, description);

  // Cover theme
  const coverTheme: CoverTheme = {
    variant: getRandomVariant(),
    pattern: 'classic_border',
  };

  const estimatedReadTimeMinutes = Math.max(1, Math.ceil(totalWordCount / 200));

  return {
    title,
    author,
    description,
    category,
    status: 'want_to_read',
    isFavorite: false,
    rating: 0,
    coverUrl,
    coverTheme,
    tags: ['EPUB', category],
    totalWords: totalWordCount,
    estimatedReadTimeMinutes,
    currentProgress: 0,
    currentChapterIndex: 0,
    chapters,
    fileType: 'epub',
    originalFileName: file.name,
  };
}

export async function parseTextFile(file: File): Promise<Omit<Book, 'id' | 'dateAdded'>> {
  const text = await file.text();
  const title = file.name.replace(/\.(txt|md)$/i, '');
  const isMd = file.name.endsWith('.md');

  // Attempt smart chapter splitting
  // Matches: "Bab 1", "BAB I", "Chapter 1", "# Heading", "BAGIAN 1"
  const chapterRegex = /^(?:#+\s+|bab\s+\w+|chapter\s+\w+|bagian\s+\w+|epilog|prolog|prakata)[\s\:\.\-].*$/gmi;
  const lines = text.split('\n');

  const chapters: Chapter[] = [];
  let currentTitle = 'Bab 1: Pembuka';
  let currentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeading = isMd 
      ? line.trim().startsWith('#')
      : /^(?:bab|chapter|bagian|prolog|epilog)\s+[\w\d\.\:\-]/i.test(line.trim());

    if (isHeading && currentLines.length > 5) {
      const content = currentLines.join('\n').trim();
      const words = content.split(/\s+/).filter(Boolean).length;
      chapters.push({
        id: `chap-${chapters.length + 1}-${Date.now()}`,
        title: currentTitle,
        content: content,
        wordCount: words,
      });
      currentTitle = line.replace(/^#+\s*/, '').trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Push remaining lines
  if (currentLines.length > 0) {
    const content = currentLines.join('\n').trim();
    const words = content.split(/\s+/).filter(Boolean).length;
    chapters.push({
      id: `chap-${chapters.length + 1}-${Date.now()}`,
      title: currentTitle,
      content: content,
      wordCount: words,
    });
  }

  // If no chapters were split (single block of text), chunk by ~1,500 words
  if (chapters.length === 1 && chapters[0].wordCount > 3000) {
    const rawWords = text.split(/\s+/);
    const chunkSize = 1500;
    const chunkedChapters: Chapter[] = [];
    let chunkIdx = 1;

    for (let i = 0; i < rawWords.length; i += chunkSize) {
      const slice = rawWords.slice(i, i + chunkSize).join(' ');
      chunkedChapters.push({
        id: `chap-${chunkIdx}-${Date.now()}`,
        title: `Bagian ${chunkIdx}`,
        content: slice,
        wordCount: slice.split(/\s+/).length,
      });
      chunkIdx++;
    }
    chapters.length = 0;
    chapters.push(...chunkedChapters);
  }

  const totalWords = chapters.reduce((acc, c) => acc + c.wordCount, 0);
  const estimatedReadTimeMinutes = Math.max(1, Math.ceil(totalWords / 200));
  const category = guessCategory(title, text.substring(0, 500));

  return {
    title,
    author: 'Penulis Berkas',
    description: text.substring(0, 200).replace(/\s+/g, ' ').trim() + '...',
    category,
    status: 'want_to_read',
    isFavorite: false,
    rating: 0,
    coverTheme: {
      variant: getRandomVariant(),
      pattern: 'minimal',
    },
    tags: [isMd ? 'Markdown' : 'Dokumen Teks', category],
    totalWords,
    estimatedReadTimeMinutes,
    currentProgress: 0,
    currentChapterIndex: 0,
    chapters,
    fileType: isMd ? 'md' : 'txt',
    originalFileName: file.name,
  };
}

function resolveRelativePath(baseDir: string, relativePath: string): string {
  if (!baseDir) return relativePath;
  const parts = (baseDir + relativePath).split('/');
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.' || part === '') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return stack.join('/');
}

function guessCategory(title: string, sample: string): BookCategory {
  const combined = (title + ' ' + sample).toLowerCase();
  if (combined.includes('silat') || combined.includes('naga') || combined.includes('pendekar') || combined.includes('sihir') || combined.includes('fantasi')) {
    return 'Fantasi & Petualangan';
  }
  if (combined.includes('detektif') || combined.includes('misteri') || combined.includes('pembunuhan') || combined.includes('investigasi')) {
    return 'Misteri & Detektif';
  }
  if (combined.includes('cinta') || combined.includes('asmara') || combined.includes('hati') || combined.includes('rindu') || combined.includes('romansa')) {
    return 'Romansa';
  }
  if (combined.includes('sejarah') || combined.includes('kerajaan') || combined.includes('biografi') || combined.includes('perang')) {
    return 'Sejarah & Biografi';
  }
  if (combined.includes('sains') || combined.includes('teknologi') || combined.includes('antariksa') || combined.includes('robot')) {
    return 'Fiksi Ilmiah';
  }
  if (combined.includes('esai') || combined.includes('catatan') || combined.includes('filosofi') || combined.includes('refleksi')) {
    return 'Non-Fiksi & Esai';
  }
  if (combined.includes('syair') || combined.includes('pantun') || combined.includes('puisi') || combined.includes('hikayat')) {
    return 'Puisi & Sastra Klasik';
  }
  return 'Novel Sastra';
}

function getRandomVariant(): CoverTheme['variant'] {
  const variants: CoverTheme['variant'][] = ['burgundy', 'navy', 'emerald', 'noir', 'amber', 'terracotta', 'slate'];
  return variants[Math.floor(Math.random() * variants.length)];
}
