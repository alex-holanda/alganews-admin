import { Popconfirm } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import React from 'react';

interface DoubleConfirmProps {
  children: React.ReactNode;
  disabled?: boolean;
  popConfirmTitle: string;
  modalTitle: string;
  modalContent: string;
  onConfirm?: () => void;
}

export function DoubleConfirm(props: DoubleConfirmProps) {
  return (
    <Popconfirm
      title={props.popConfirmTitle}
      disabled={props.disabled}
      onConfirm={() => {
        confirm({
          title: props.modalTitle,
          content: props.modalContent,
          onOk: props.onConfirm,
          cancelText: 'Cancelar',
        });
      }}
    >
      {props.children}
    </Popconfirm>
  );
}
