export default (event: any): boolean =>
  !!(event && typeof event.stopPropagation === 'function');
