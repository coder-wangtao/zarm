//  React 组件（或者任意对象）挂载额外的静态属性
// const Button = () => <button>Click</button>;
// const ButtonWithGroup = attachPropertiesToComponent(Button, {
//   Group: ButtonGroup, // 给 Button 添加静态属性 Button.Group
// });
// 这样就可以：
// <Button.Group />

export default function attachPropertiesToComponent<C, P extends Record<string, any>>(
  component: C,
  properties: P,
): C & P {
  const ret = component as any;

  Object.keys(properties).forEach((key) => {
    // 对象的所有自有属性（hasOwnProperty 避免原型链上的属性被误挂载）
    if (Object.prototype.hasOwnProperty.call(properties, key)) {
      ret[key] = properties[key];
    }
  });

  return ret;
}
