import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface FileEntry {
  path: string;
  content: string;
}

interface FixResult {
  fixed: boolean;
  files: FileEntry[];
  changes: string[];
  errors: string[];
}

const SYSTEM_PROMPT = `Du bist ein Experte für Projekt-Fehlerbehebung. Analysiere die Projektdateien und behebe häufige Fehler automatisch.

HÄUFIGE PROBLEME DIE DU BEHEBEN SOLLST:
1. Next.js Version-Mismatches (@next/swc vs next Version)
2. Fehlende oder korrupte favicon.ico (ersetze durch minimales gültiges Icon)
3. Fehlende package-lock.json oder yarn.lock
4. Fehlende .env.example Dateien
5. Fehlende oder fehlerhafte next.config.js/ts
6. Fehlende oder fehlerhafte tsconfig.json
7. Inkompatible Node.js Versionen in package.json
8. Fehlende oder falsche Vercel/Netlify Konfiguration

REGELN:
- Analysiere package.json um das Framework zu erkennen (Next.js, React, Vue, etc.)
- Prüfe Version-Kompatibilität zwischen Dependencies
- Korrigiere nur echte Fehler, ändere keine funktionierenden Features
- Gib NUR valides JSON zurück

AUSGABE-FORMAT (JSON):
{
  "hasIssues": true/false,
  "issues": ["Liste der gefundenen Probleme"],
  "fixes": [
    {
      "file": "pfad/zur/datei",
      "action": "create" | "modify" | "delete",
      "content": "neuer Dateiinhalt (bei create/modify)",
      "reason": "Warum diese Änderung nötig ist"
    }
  ]
}`;

export async function analyzeAndFixProject(files: FileEntry[]): Promise<FixResult> {
  const result: FixResult = {
    fixed: false,
    files: [],
    changes: [],
    errors: [],
  };

  try {
    const packageJson = files.find(f => f.path === 'package.json');
    if (!packageJson) {
      result.errors.push("Keine package.json gefunden - kein Node.js Projekt");
      return result;
    }

    const relevantFiles = files.filter(f => 
      f.path === 'package.json' ||
      f.path === 'package-lock.json' ||
      f.path === 'next.config.js' ||
      f.path === 'next.config.ts' ||
      f.path === 'next.config.mjs' ||
      f.path === 'tsconfig.json' ||
      f.path === 'vercel.json' ||
      f.path === '.nvmrc' ||
      f.path === '.node-version' ||
      f.path.endsWith('.env.example') ||
      f.path === 'app/favicon.ico' ||
      f.path === 'public/favicon.ico'
    ).slice(0, 10);

    const fileList = relevantFiles.map(f => `--- ${f.path} ---\n${f.content.substring(0, 2000)}`).join('\n\n');

    const allFilePaths = files.map(f => f.path).join('\n');

    const prompt = `Analysiere dieses Projekt und behebe Fehler:

ALLE DATEIEN IM PROJEKT:
${allFilePaths}

INHALT DER RELEVANTEN DATEIEN:
${fileList}

Gib die Analyse und Fixes als JSON zurück.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_completion_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content || "";
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      result.errors.push("KI-Antwort konnte nicht geparst werden");
      return result;
    }

    const analysis = JSON.parse(jsonMatch[0]);

    if (!analysis.hasIssues || !analysis.fixes || analysis.fixes.length === 0) {
      result.changes.push("Keine Probleme gefunden - Projekt sieht gut aus!");
      result.files = files;
      return result;
    }

    const modifiedFiles = new Map<string, string>();
    files.forEach(f => modifiedFiles.set(f.path, f.content));

    for (const fix of analysis.fixes) {
      if (fix.action === 'create' || fix.action === 'modify') {
        modifiedFiles.set(fix.file, fix.content);
        result.changes.push(`${fix.action === 'create' ? 'Erstellt' : 'Geändert'}: ${fix.file} - ${fix.reason}`);
      } else if (fix.action === 'delete') {
        modifiedFiles.delete(fix.file);
        result.changes.push(`Gelöscht: ${fix.file} - ${fix.reason}`);
      }
    }

    result.fixed = true;
    result.files = Array.from(modifiedFiles.entries()).map(([path, content]) => ({ path, content }));

  } catch (error) {
    console.error("AI Fixer error:", error);
    result.errors.push(`KI-Analyse fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    result.files = files;
  }

  return result;
}

export function generateMinimalFavicon(): Buffer {
  const icoHeader = Buffer.alloc(22);
  icoHeader.writeUInt16LE(0, 0);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(1, 4);
  icoHeader.writeUInt8(16, 6);
  icoHeader.writeUInt8(16, 7);
  icoHeader.writeUInt8(0, 8);
  icoHeader.writeUInt8(0, 9);
  icoHeader.writeUInt16LE(1, 10);
  icoHeader.writeUInt16LE(32, 12);
  
  const bmpSize = 40 + (16 * 16 * 4) + (16 * 4);
  icoHeader.writeUInt32LE(bmpSize, 14);
  icoHeader.writeUInt32LE(22, 18);
  
  const bmpHeader = Buffer.alloc(40);
  bmpHeader.writeUInt32LE(40, 0);
  bmpHeader.writeInt32LE(16, 4);
  bmpHeader.writeInt32LE(32, 8);
  bmpHeader.writeUInt16LE(1, 12);
  bmpHeader.writeUInt16LE(32, 14);
  bmpHeader.writeUInt32LE(0, 16);
  bmpHeader.writeUInt32LE(16 * 16 * 4, 20);
  
  const pixels = Buffer.alloc(16 * 16 * 4, 0);
  for (let i = 0; i < 16 * 16; i++) {
    pixels[i * 4] = 255;
    pixels[i * 4 + 1] = 215;
    pixels[i * 4 + 2] = 0;
    pixels[i * 4 + 3] = 255;
  }
  
  const mask = Buffer.alloc(16 * 4, 0);
  
  return Buffer.concat([icoHeader, bmpHeader, pixels, mask]);
}
