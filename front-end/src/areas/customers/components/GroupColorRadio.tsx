import { FC, useEffect, useState } from "react";
import { ColorResource } from "../../../resources";

type GroupColorRadioProps = {
    defaultValue: number;
    colors: ColorResource[];
    onChange: (value: number, color: ColorResource) => void
}

const GroupColorRadio: FC<GroupColorRadioProps> = ({
    defaultValue,
    colors,
    onChange
}) => {
    const [selected, setSelected] = useState(defaultValue)

    const handleSelectColor = (color: ColorResource) => {
        setSelected(color.id)
        onChange(color.id, color)
    }

    useEffect(() => {
        setSelected(defaultValue)
    }, [defaultValue])

    return <div className="flex py-2 gap-x-2 gap-y-3 flex-wrap">
        {colors.map(color => <div
            key={color.id}
            className="w-8 h-8 rounded-full p-1 flex items-center justify-center cursor-pointer"
            onClick={() => handleSelectColor(color)}
            style={{
                border: color?.id === selected ? `1px solid ${color?.hexCode}` : ''
            }}>
                <div style={{
                    backgroundColor: color?.hexCode,
                }} className="rounded-full h-full w-full"></div>
        </div>)}
    </div>
};

export default GroupColorRadio;
