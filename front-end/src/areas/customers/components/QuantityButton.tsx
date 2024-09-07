import { FC, useEffect, useState } from "react";

type QuantityButtonProps = {
    size?: "small" | "medium" | "large";
    defaultValue: number;
    onChange?: (value: number) => void;
    onIncrease?: (value: number) => void;
    onDescrease?: (value: number) => void;
}

const QuantityButton: FC<QuantityButtonProps> = ({
    onChange,
    onIncrease,
    onDescrease,
    defaultValue,
    size
}) => {
    const [count, setCount] = useState(defaultValue)
    const [classNameWrapper, setClassNameWrapper] = useState('px-4 py-2 text-lg')
    const [classNameBtn, setClassNameBtn] = useState('w-6 h-6')

    const handleDescrease = () => {
        if(count > 0) {
            onChange?.(count - 1)
            onDescrease?.(count - 1)
            setCount(count - 1)
        }
    }

    const handleIncrease = () => {
        onChange?.(count + 1)
        onIncrease?.(count + 1)
        setCount(count + 1)
    }

    useEffect(() => {
        switch(size) {
            case 'small':
                setClassNameWrapper('px-2 py-1 text-sm')
                setClassNameBtn('w-4 h-4')
                break;
            case 'large':
                setClassNameWrapper('px-6 py-3 text-lg')
                setClassNameBtn('w-8 h-8')
                break;
        }
    }, [])

    return <div className={`${classNameWrapper} bg-slate-50 flex items-center gap-x-3 border-[1px] border-gray-200 rounded-xl`}>
        <button onClick={handleDescrease} className={`${classNameBtn} rounded-full bg-white hover:bg-gray-200 flex justify-center items-center`}>-</button>
        <span>{count}</span>
        <button onClick={handleIncrease} className={`${classNameBtn} rounded-full bg-white hover:bg-gray-200 flex justify-center items-center`}>+</button>
    </div>;
};

export default QuantityButton;
