import Papa from 'papaparse';

export interface PaperItem {
  title: string;
  description: string;
  link: string;
  difficulty: string;
  field: string;
  date: string;
}

export const loadPapersFromCSV = async (csvUrl: string): Promise<PaperItem[]> => {
  try {
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as PaperItem[]);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Failed to load CSV:', error);
    throw new Error('无法加载论文数据');
  }
};