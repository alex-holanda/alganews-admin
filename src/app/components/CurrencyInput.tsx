import { useCallback, useState } from 'react';

type CurrencyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  onChange: (
    e: React.InputHTMLAttributes<HTMLInputElement>,
    reals: number
  ) => any;
};

export default function CurrencyInput(props: CurrencyInputProps) {
  const convertValueToBRL = useCallback((value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  const [inputValue, setInputValue] = useState(
    typeof props.value === 'number' ? convertValueToBRL(props.value) : 'R$ 0,00'
  );

  return (
    <input
      className='ant-input'
      {...props}
      value={inputValue}
      onChange={(e) => {
        const { value } = e.currentTarget;
        const cents = value.replace(/[^(0-9)]/gi, '');
        const reals = Number(cents) / 100;

        setInputValue(convertValueToBRL(reals));

        props.onChange && props.onChange(e, reals);
      }}
    />
  );
}
