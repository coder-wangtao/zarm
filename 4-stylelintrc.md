<!--
{
  "extends": "stylelint-config-za/scss",
  "rules": {
    "unit-case": null
  }
}
-->

"extends": "stylelint-config-za/scss"
表示这个配置继承自 stylelint-config-za/scss，它是一个预设的 Stylelint 配置（专门针对 SCSS 文件）。
相当于你先拿这个预设的规则作为基础，然后可以在 "rules" 里进行修改或覆盖。
"rules": { "unit-case": null }
unit-case 是 Stylelint 的一个规则，用来规定单位（如 px、em、rem）的大小写风格。
默认可能要求小写（px），或者大写（PX）。
设置为 null 表示 禁用这个规则，也就是 SCSS 中单位大小写不做检查。
