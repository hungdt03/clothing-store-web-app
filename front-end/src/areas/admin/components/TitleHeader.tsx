import { Button, Image, Popover } from "antd";
import { FC, ReactNode } from "react";
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import SearchBar from "./SearchBar";
import images from "../../../assets";

type TitleHeaderProps = {
    callback?: () => void;
    title: string;
    btnTitle?: string;
    isShowBtnTitle?: boolean;
    value?: string;
    onChange?: (value: string) => void,
    isShowFilterBtn?: boolean,
    isShowSearchBar?: boolean,
    isShowSortSelection?: boolean,
    onFilterClick?: () => void,
    sortSelection?: ReactNode
}

const TitleHeader: FC<TitleHeaderProps> = ({
    callback = () => { },
    title,
    btnTitle = "Thêm mới",
    isShowBtnTitle = true,
    value,
    isShowSearchBar = true,
    isShowFilterBtn = false,
    isShowSortSelection = false,
    onFilterClick,
    onChange,
    sortSelection
}) => {
    return <div className="flex justify-between items-center">
        <span className="font-semibold text-xl">{title}</span>
        <div className="flex items-center gap-x-4">
            {isShowSearchBar && <SearchBar value={value} onChange={onChange} />}
            {isShowSortSelection && <Popover arrow={false} trigger='click' title={sortSelection} placement="bottomRight">
                <div className="flex gap-x-2 items-center cursor-pointer">
                    <Image
                        preview={false}
                        src={images.sort}
                        width='20px'
                    />
                    <span className="text-sm font-semibold">Sắp xếp</span>
                </div>
            </Popover>}
            {isShowFilterBtn && <Button onClick={onFilterClick} type="primary" icon={<FilterOutlined />}>Lọc nâng cao</Button>}
            {isShowBtnTitle && <Button onClick={callback} type="primary" icon={<PlusOutlined />}>{btnTitle}</Button>}
        </div>
    </div>
}

export default TitleHeader;
