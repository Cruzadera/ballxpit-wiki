declare module 'node:*' {
  const value: any;
  export = value;
}

declare module 'rollup/parseAst' {
  export const parseAst: any;
  export const parseAstAsync: any;
}
