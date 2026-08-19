export type CategorizedArticle = { category: { name: string } };

export function countPublishedByCategory<T extends CategorizedArticle>(articles: T[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const article of articles) {
    counts.set(article.category.name, (counts.get(article.category.name) ?? 0) + 1);
  }
  return counts;
}

export function publishedCategoryCount(counts: Map<string, number>, categoryName: string): number {
  return counts.get(categoryName) ?? 0;
}
