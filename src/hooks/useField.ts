import {
  useRef,
  useEffect,
  useCallback,
  SyntheticEvent,
} from 'react';
import useForm from './useForm';
import noop from '../helpers/noop';

export type FieldProps = {
  name: string;
  type: string;
  value?: any;
  error?: any;
  multiple?: boolean;
  onChange?: (event: SyntheticEvent) => void;
  onFocus?: (event: SyntheticEvent) => void;
  onBlur?: (event: SyntheticEvent) => void;
  validate?: (value: any, values: object) => any;
};

const useField = (props: FieldProps): FieldProps => {
  const form = useForm();
  const { name, onChange = noop, onFocus = noop, onBlur = noop } = props;

  const willMount = useRef(true);
  if (willMount.current) {
    form.setField(name).mount(props);
  }
  useEffect(() => {
    willMount.current = false;
    return form.setField(name).unmount;
  }, []);

  const { type, value, error, multiple } = form.getField(name);

  const setFieldValue = useCallback(
    (event: SyntheticEvent) => {
      form.setField(name).value(event);
    },
    [name, value]
  );

  const handleChange = (event: SyntheticEvent) => {
    setFieldValue(event);
    onChange(event);
  };

  const handleFocus = (event: SyntheticEvent) => {
    setFieldValue(event);
    onFocus(event);
  };

  const handleBlur = (event: SyntheticEvent) => {
    setFieldValue(event);
    onBlur(event);
  };

  return {
    name,
    type: type === 'select' ? undefined : type,
    value,
    error,
    multiple,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
};

export default useField;
