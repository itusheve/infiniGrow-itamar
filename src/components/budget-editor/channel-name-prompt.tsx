import React from 'react';
import { Input, Modal } from 'antd';

const promptDialog = (
  title: string,
  message?: string,
  defaultValue?: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let inputRef = null;
    let inputValue = '';

    const handleOk = () => {
      resolve(inputValue);
      Modal.destroyAll();
    };

    const handleCancel = () => {
      reject();
      Modal.destroyAll();
    };

    Modal.confirm({
      title: title,
      content: (
        <div>
          <p>{message}</p>
          <Input
            defaultValue={defaultValue}
            ref={(input) => {
              inputRef = input;
              if (inputRef) {
                inputRef.focus();
              }
            }}
            onChange={(e) => (inputValue = e.target.value)}
          />
        </div>
      ),
      onOk: handleOk,
      onCancel: handleCancel,
      okText: 'OK',
      cancelText: 'Cancel',
    });
  });
};

export default promptDialog;
