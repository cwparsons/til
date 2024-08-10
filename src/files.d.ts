declare module '*.yml' {
  const value: {
    url: string;
    title?: string;
    tags: string[];
  }[];

  export default value;
}
