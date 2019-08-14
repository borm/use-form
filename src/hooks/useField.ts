import { useCallback, useState } from "react";
import useForm from "./useForm";

const useField = (name: string) => {
  const form = useForm();
  const [{ value }, setState] = useState(form.getState(name));
  // console.log(initialState);

  const onChange = useCallback((event) => {
    form.setState('values', name, event.target.value);
    setState(form.getState(name));
  }, [name, value]);

  return { value, onChange };
};

export default useField;