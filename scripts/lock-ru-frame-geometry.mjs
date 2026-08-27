/** Фиксирует геометрию русских кадров по их английским оригиналам. */
import { copyFile, readFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const CASES = ['dssl', 'vet', 'pawly', 'agent-ops'];

async function files(dir, relative = '') {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) result.push(...await files(path.join(dir, entry.name), child));
    else if (entry.name.endsWith('.webp')) result.push(child);
  }
  return result;
}

for (const name of CASES) {
  const englishDir = path.resolve(`public/media/case-${name}`);
  const russianDir = path.resolve(`public/media/case-${name}-ru`);
  for (const relative of await files(russianDir)) {
    const english = path.join(englishDir, relative);
    const russian = path.join(russianDir, relative);
    let target;
    try {
      target = await sharp(english).metadata();
    } catch {
      continue;
    }
    const russianBuffer = await readFile(russian);
    const current = await sharp(russianBuffer).metadata();
    if (current.width === target.width && current.height === target.height) continue;
    if (!target.width || !target.height) continue;
    const temporary = `${russian}.geometry.webp`;
    await sharp(russianBuffer)
      .resize({
        width: target.width,
        height: target.height,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .webp({ quality: 82 })
      .toFile(temporary);
    await copyFile(temporary, russian);
    await unlink(temporary);
    console.log(`${name}/${relative}: ${current.width}×${current.height} → ${target.width}×${target.height}`);
  }
}
