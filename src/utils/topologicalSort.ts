import { PackageWithConfig } from '../types/mod.types';

export function topologicalSort(
  graph: PackageWithConfig[]
): PackageWithConfig[] {
  const visited: Record<string, boolean> = {};
  const sorted: PackageWithConfig[] = [];

  function visit(node: PackageWithConfig) {
    if (!visited[node.packageName]) {
      visited[node.packageName] = true;
      if (node.config.dependencies) {
        for (const dep of node.config.dependencies) {
          const dependent = graph.find(item => item.packageName === dep);
          if (dependent) {
            visit(dependent);
          }
        }
      }
      sorted.push(node);
    }
  }

  for (const node of graph) {
    visit(node);
  }

  return sorted;
}
