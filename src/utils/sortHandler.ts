/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleSort = (key: any, setSortConfig: any) => {
  setSortConfig((prev: { key: any; direction: string }) => {
    if (prev.key === key) {
      const newDir =
        prev.direction === "asc"
          ? "desc"
          : prev.direction === "desc"
          ? null
          : "asc";
      return { key, direction: newDir };
    }
    return { key, direction: "asc" };
  });
};
