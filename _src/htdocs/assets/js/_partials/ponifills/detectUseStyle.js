export default function detectUseStyle(property, value) {
  const div = document.createElement('div');
  div.style.setProperty(property, value);
  return div.style.getPropertyValue(property).indexOf(value) !== -1;
}
