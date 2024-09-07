import { FC, useEffect, useState } from "react";
import ColorCheckable from "./ColorCheckable";
import { ColorResource } from "../../../resources";

type GroupColorCheckableProps = {
    colors: ColorResource[];
    onChange: (values: number[]) => void;
    value?: number[]
}

const GroupColorCheckable: FC<GroupColorCheckableProps> = ({
    colors,
    onChange,
    value
}) => {
    const [checkedColors, setCheckedColors] = useState<number[]>([])

    const handleChangeChecked = (checked: boolean, value: number) => {
        if(checked && !checkedColors.includes(value)) {
            const newCheckedColors = [...checkedColors, value]
            onChange(newCheckedColors)
            setCheckedColors(newCheckedColors)
        } else if(!checked && checkedColors.includes(value)) {
            const newCheckedColors = checkedColors.filter(c => c !== value)
            onChange(newCheckedColors)
            setCheckedColors(newCheckedColors)
        }
    }

    useEffect(() => {
        setCheckedColors(value ?? [])
    }, [value])

    return <div className="flex p-2 gap-x-2 gap-y-3 flex-wrap">
        {colors.map(color => <ColorCheckable
            key={color.id}
            title={color.name}
            hexCode={color.hexCode}
            value={checkedColors.includes(color.id)}
            onChange={(checked) => handleChangeChecked(checked, color.id)}
        />)}
    </div>
};

export default GroupColorCheckable;
