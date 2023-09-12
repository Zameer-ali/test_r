import React, { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Input,
    FormHelperText,
} from "@mui/material";

export default function InputField({
    label = '',
    styles,
    error = '',
    ...props }) {


    const _id = 'input_' + Math.floor(Math.random())
    return (
        <FormControl sx={{ width: "100%", ...styles }} variant="standard">
            <InputLabel htmlFor={_id}>
                {label}
            </InputLabel>
            <Input
                id={_id}
                error={error !== ''}
                {...props}
            />
            {error !== '' && <FormHelperText sx={{ color: 'primary.main' }} >{error}</FormHelperText>}
        </FormControl>
    );
}