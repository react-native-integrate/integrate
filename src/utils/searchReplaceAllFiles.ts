import fs, { Dirent } from 'fs';
import path from 'path';

export async function searchReplaceAllFiles(
  folderPath: string,
  search: string,
  replace: string,
  ignoreCase: boolean
): Promise<number> {
  const searchRegExp = new RegExp(search, ignoreCase ? 'gi' : 'g');
  let changes = 0;
  const files = await new Promise<Dirent[]>((resolve, reject) =>
    fs.readdir(
      folderPath,
      { withFileTypes: true },
      (err: Error | null, files: Dirent[]) => {
        if (err) reject(err);
        else resolve(files);
      }
    )
  );
  for (const file of files) {
    const filePath = path.join(folderPath, file.name);
    if (file.isDirectory()) {
      changes += await searchReplaceAllFiles(
        filePath,
        search,
        replace,
        ignoreCase
      );
    } else {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      if (searchRegExp.test(fileContent)) {
        const newFileContent = fileContent.replace(searchRegExp, replace);
        fs.writeFileSync(filePath, newFileContent);
        changes++;
      }
    }
  }
  return changes;
}
