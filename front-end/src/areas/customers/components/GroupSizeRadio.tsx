import { FC, useEffect, useState } from "react";
import { SizeResource } from "../../../resources";

type GroupSizeRadioProps = {
    defaultValue: number;
    value: number;
    sizes: SizeResource[];
    onChange: (value: number, size: SizeResource) => void
}

const GroupSizeRadio: FC<GroupSizeRadioProps> = ({
    defaultValue,
    value,
    sizes,
    onChange
}) => {
    const [selected, setSelected] = useState(defaultValue)

    const handleSelectSize = (size: SizeResource) => {
        setSelected(size.id)
        onChange(size.id, size)
    }

    useEffect(() => {
        setSelected(value)
    }, [value])

    return <div className="flex py-2 gap-x-2 gap-y-3 flex-wrap">
        {sizes.map(size => <div
            key={size.id}
            className="w-10 h-10 p-[2px] flex items-center border-[1px] rounded-md justify-center cursor-pointer"
            onClick={() => handleSelectSize(size)}
            style={{
                backgroundColor: size?.id === selected ? '#fb923c' : 'white',
                color: size?.id === selected ? 'white' : 'black',
            }}>
                {size?.eSize}
        </div>)}
    </div>
};

export default GroupSizeRadio;
