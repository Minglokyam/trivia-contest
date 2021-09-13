import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
};

const InputField: React.FC<InputFieldProps> = ({label, size: _, ...props}) => {
    const [field, {error}] = useField(props);
    const {placeholder} = props;

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props} id={field.name} placeholder={placeholder} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};

export { InputField };
