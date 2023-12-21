export function formatWebhookTopicLabel(topic) {
  const [label, action] = topic.split('/');
  const formattedLabel = label.includes('_') ? label.replaceAll('_', ' ') : label;
  return `${upperCaseFirstLetter(action)} ${upperCaseFirstLetter(formattedLabel)}`;
}

export function formatMetafieldTypeLabel(type) {
  const formattedType = type.replaceAll('_', ' ');
  return upperCaseFirstLetter(formattedType);
}

function upperCaseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
