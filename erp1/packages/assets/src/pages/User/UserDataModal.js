import {Modal, Select, SettingToggle, TextField} from '@shopify/polaris';
import React, {useState} from 'react';

export default function UserDataModal({inputRef, isEditing = false}) {
  const [userData, setUserData] = useState(inputRef.current);

  const handleChange = (value, name) => {
    setUserData(prev => ({...prev, [name]: value}));
    inputRef.current = {...inputRef.current, [name]: value};
  };
  return (
    <Modal.Section>
      <TextField
        label="Email"
        autoComplete="off"
        name="email"
        value={userData.email}
        onChange={value => handleChange(value, 'email')}
      />
      <TextField
        label="Full name"
        autoComplete="off"
        name="fullName"
        value={userData.fullName}
        onChange={value => handleChange(value, 'fullName')}
      />
      {isEditing && (
        <TextField
          label="English name"
          autoComplete="off"
          name="englishName"
          value={userData.englishName}
          onChange={value => handleChange(value, 'englishName')}
        />
      )}
      <Select
        label="Role"
        options={[
          {label: 'Admin', value: 'admin'},
          {label: 'User', value: 'user'}
        ]}
        value={userData.role.toString()}
        onChange={value => handleChange([value], 'role')}
      />
      <SettingToggle
        children="Active"
        action={{
          content: userData.active ? 'Inactive' : 'Active',
          onAction: () => handleChange(!userData.active, 'active')
        }}
        enabled={userData.active}
      />
    </Modal.Section>
  );
}
