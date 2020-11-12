import {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import FormContext from '../context';
import { FieldState } from '../field';
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

/*export interface Props {
  [key: string]: any;
}*/

const useField = (props: FieldProps): FieldState => {
  const form = useContext(FormContext);
  const { name, onChange = noop, onFocus = noop, onBlur = noop, validate = noop, ...rest } = props;

  const willMount = useRef(true);
  if (willMount.current) {
    form.setField(name).mount(props);
  }
  useEffect(() => {
    willMount.current = false;
    return form.setField(name).unmount;
  }, []);

  const { type, value, multiple } = form.getField(name);
  const { error } = form.getMeta(name);

  const handleChange = useCallback((event: SyntheticEvent) => {
    form.setField(name).value(event);
    onChange(event);
  }, [name]);

  const handleFocus = useCallback((event: SyntheticEvent) => {
    form.setField(name).meta('touched', true);
    onFocus(event);
  }, [name]);

  const handleBlur = useCallback((event: SyntheticEvent) => {
    form.setField(name).value(event);
    onBlur(event);
  }, [name]);

  return {
    input: {
      name,
      type: type === 'select' ? undefined : type,
      ...type === 'checkbox' && {
        checked: value,
      },
      value,
      multiple,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
    meta: {
      error,
    },
    ...rest,
  };
};

export default useField;
