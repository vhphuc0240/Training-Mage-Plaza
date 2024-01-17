import {
  Button,
  Card,
  Form,
  FormLayout,
  Select,
  Stack,
  TextField,
  TextStyle
} from '@shopify/polaris';
import React from 'react';
import PropTypes from 'prop-types';
import useEditApi from '@assets/hooks/api/useEditApi';

export default function Setting({settings, handleChange}) {
  const {handleEdit: handleUpdateSetting, editing: updating} = useEditApi({
    url: '/settings',
    fullResp: true
  });
  return (
    <Card sectioned>
      <Form onSubmit={() => handleUpdateSetting(settings)}>
        <FormLayout>
          <TextField
            label={<TextStyle variation="strong">Feed title</TextStyle>}
            autoComplete="off"
            name="title"
            value={settings?.title}
            onChange={value => handleChange(value, 'title')}
          />

          <Stack alignment="trailing" distribution="fill">
            <Stack.Item>
              <TextField
                autoComplete="off"
                label={<TextStyle variation="strong">Post spacing</TextStyle>}
                type="number"
                name="spacing"
                value={settings?.spacing?.replace('px', '')}
                onChange={value => handleChange(`${value}px`, 'spacing')}
              />
            </Stack.Item>
          </Stack>

          <Stack alignment="trailing" distribution="fill">
            <Stack.Item>
              <Select
                label={<TextStyle variation="strong">Layout</TextStyle>}
                value="grid"
                onChange={value => handleChange(value, 'layout')}
                options={[
                  {label: 'Open in new tab', value: 'new_tab'},
                  {
                    label: 'Grid',
                    value: 'grid'
                  }
                ]}
              />
            </Stack.Item>
          </Stack>

          <Stack alignment="trailing" distribution="fill">
            <TextField
              autoComplete="off"
              label={<TextStyle variation="strong">Number of rows</TextStyle>}
              type="number"
              name="row"
              value={String(settings?.row)}
              onChange={value => handleChange(value, 'row')}
            />

            <Stack.Item>
              <TextField
                autoComplete="off"
                label={<TextStyle variation="strong">Number of columns</TextStyle>}
                type="number"
                name="col"
                value={String(settings?.col)}
                onChange={value => handleChange(value, 'col')}
              />
            </Stack.Item>
          </Stack>

          <Button primary fullWidth submit loading={updating}>
            <TextStyle variation="strong">Save feed</TextStyle>
          </Button>
        </FormLayout>
      </Form>
    </Card>
  );
}

Setting.propTypes = {
  settings: PropTypes.shape({
    col: PropTypes.string,
    row: PropTypes.string,
    title: PropTypes.string,
    spacing: PropTypes.string
  }),
  handleUpdate: PropTypes.func,
  updating: PropTypes.bool,
  handleChange: PropTypes.func
};
