import * as React from 'react';

// 它允许 T 类型的值为 null。
export type Nullable<T> = T | null;

// 这个类型会提取对象类型 T 中所有属性值是 string 类型的属性名。例如，如果有如下的对象类型：
// interface A {
//   name: string;
//   age: number;
// }
// 那么 StringPropertyNames<A> 的结果将是类型 "name"。
export type StringPropertyNames<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

// type Result = Replace<'hello world', 'world', 'TypeScript'>; // 'hello TypeScript'
export type Replace<
  S extends string,
  MatchStr extends string,
  ReplaceStr extends string,
> = S extends `${infer Left}${MatchStr}${infer Right}` ? `${Left}${ReplaceStr}${Right}` : S;

// 这个接口是对 React.HTMLProps 的一个扩展，允许在 style 属性中加入额外的自定义属性类型 T
export interface HTMLProps<T extends object = {}> {
  className?: string;
  style?: React.CSSProperties & Partial<T>;
}
