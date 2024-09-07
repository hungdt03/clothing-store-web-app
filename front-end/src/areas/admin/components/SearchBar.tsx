import { FC } from "react";
import { SearchOutlined } from '@ant-design/icons';

type SearchBarProps = {
    value?: string;
    onChange?: (value: string) => void
}

const SearchBar: FC<SearchBarProps> = ({
    value,
    onChange
}) => {


    return <div className="flex items-center gap-x-2 border-[1px] border-primary rounded-lg px-2 py-1">
        <SearchOutlined className="text-primary" />
        <input 
            className="border-none outline-none relative top-[2px]" 
            placeholder="Tìm kiếm ở đây ..."
            value={value}
            onChange={e => onChange?.(e.target.value)}
        />
    </div>
};

export default SearchBar;
