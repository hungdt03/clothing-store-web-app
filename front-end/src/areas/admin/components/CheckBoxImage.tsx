import { Checkbox, Image } from "antd";
import { FC, useState } from "react";
import { ImageResource } from "../../../resources";

type CheckBoxImageProps = {
    image: ImageResource
}

const CheckBoxImage: FC<CheckBoxImageProps> = ({
    image
}) => {
    const [hover, setHover] = useState(false)
    const [show, setShow] = useState(false)
    return <span onMouseLeave={() => setHover(false)} onMouseOver={() => setHover(true)} className="hover:bg-white w-[100px] h-[100px] relative" >
        <Image width='100%' height='100%' className="rounded-xl object-cover" src={image.url} />
        {(show || hover) && <Checkbox onChange={e => setShow(e.target.checked)} value={image.id} className="absolute -top-2 -right-2 z-50" />}
    </span>
};

export default CheckBoxImage;
