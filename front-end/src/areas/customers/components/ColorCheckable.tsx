import { FC, useEffect, useState } from "react";

type ColorCheckableProps = {
    hexCode: string;
    title: string;
    value?: boolean;
    onChange: (value: boolean) => void
}

const ColorCheckable: FC<ColorCheckableProps> = ({
    title, hexCode, onChange, value
}) => {
    const [checked, setChecked] = useState(false)

    const handleChecked = () => {
        onChange(!checked)
        setChecked(!checked)
    }

    useEffect(() => {
        setChecked(!!value)
    }, [value])

    return <div
        onClick={handleChecked}
        className={`${checked && 'bg-primary text-white'} cursor-pointer flex rounded-3xl items-center gap-x-1 border-[1px] border-gray-200 p-[0.8px]`}
    >
        <span style={{
            backgroundColor: hexCode
        }} className="w-6 h-6 rounded-full"></span>
        <span className="pr-2">{title}</span>
    </div>;
};

export default ColorCheckable;
