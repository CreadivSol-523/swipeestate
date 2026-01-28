import { useState } from 'react';

type HandleChange<T> = (name: keyof T, value: any) => void;

interface UseFormOptions<T> {
     initialState?: T;
     externalState?: [T, React.Dispatch<React.SetStateAction<T>>];
}

export const useForm = <T extends Record<string, any> = Record<string, any>>(options: UseFormOptions<T> = {}) => {
     const { initialState = {} as T, externalState } = options;

     const [data, setData] = externalState || useState<T>(initialState);

     const handleChange: HandleChange<T> = (name, value) => {
          setData(prev => ({ ...prev, [name]: value }));
     };

     return { data, setData, handleChange };
};
