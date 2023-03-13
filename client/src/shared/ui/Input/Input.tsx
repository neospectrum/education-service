import {
    ChangeEvent,
    FC,
    InputHTMLAttributes,
    memo,
} from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import cls from './Input.module.scss';

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'label'>

interface InputProps extends HTMLInputProps {
    className?: string;
    onChange?: (value: string) => void;
    value?: string;
}

export const Input: FC<InputProps> = memo((props) => {
    const {
        className,
        onChange,
        value,
        placeholder,
        ...otherProps
    } = props;

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    return (
        <div className={classNames(cls.InputWrapper)}>
            {placeholder && <div className={cls.label}>{`${placeholder}`}</div>}
            <input
                className={classNames(cls.input, {}, [className])}
                value={value}
                onChange={onChangeHandler}
                {...otherProps}
            />
        </div>
    );
});