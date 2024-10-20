export default function alwaysUsePrototype(
  target: any,
  prototypeKey: string,
  descriptor: PropertyDescriptor
) {
  descriptor.value = target.constructor.prototype[prototypeKey];
}
