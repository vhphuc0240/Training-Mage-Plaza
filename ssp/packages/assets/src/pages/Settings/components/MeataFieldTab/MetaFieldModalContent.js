import {Modal, Select, TextField} from '@shopify/polaris';
import React, {useState} from 'react';
import {formatMetafieldTypeLabel} from '@assets/helpers/utils/formatWebhookTopicLabel';

const MetaFieldType = ['json', 'multi_line_text_field', 'number_integer'];
const MetaFieldValueType = ['string', 'integer', 'json_string'];
export default function MetaFieldModalContent({inputRef}) {
  const [metafieldData, setMetafieldData] = useState(inputRef.current);

  const typeOptions = MetaFieldType.map(type => {
    return {
      label: formatMetafieldTypeLabel(type),
      value: type
    };
  });
  const valueTypeOptions = MetaFieldValueType.map(valueType => {
    return {
      label: formatMetafieldTypeLabel(valueType),
      value: valueType
    };
  });
  const handleChange = (value, name) => {
    setMetafieldData(prev => ({...prev, [name]: value}));
    inputRef.current = {...inputRef.current, [name]: value};
  };
  return (
    <Modal.Section>
      <Select
        label="Owner Resource"
        options={[{label: 'Shop', value: 'shop'}]}
        value={metafieldData.owner_resource}
        onChange={value => handleChange([value], 'owner_resource')}
      />
      <TextField
        label="Namespace"
        autoComplete="off"
        name="namespace"
        value={metafieldData.namespace}
        onChange={value => handleChange(value, 'namespace')}
      />
      <TextField
        label="Key"
        autoComplete="off"
        name="key"
        value={metafieldData.key}
        onChange={value => handleChange(value, 'key')}
      />
      <Select
        label="Type"
        options={typeOptions}
        value={metafieldData.type}
        onChange={value => handleChange([value], 'type')}
      />
      <Select
        label="Value Type"
        options={valueTypeOptions}
        value={metafieldData.value_type}
        onChange={value => handleChange([value], 'type')}
      />
    </Modal.Section>
  );
}
