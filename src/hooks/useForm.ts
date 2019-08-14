import { useContext } from 'react';
import FormContext from '../context';

const useForm = () => useContext(FormContext);

export default useForm;
