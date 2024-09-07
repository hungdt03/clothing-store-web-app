import { Image } from "antd";
import { FC } from "react";
import images from "../../assets";
import { ProductResource } from "../../resources";
import { formatCurrencyVND } from "../../utils/format";
import { Link } from "react-router-dom";

type SearchResultItemProps = {
    product: ProductResource
}

const SearchResultItem: FC<SearchResultItemProps> = ({
    product
}) : JSX.Element => {
    return <Link to={`/product/${product.id}`} className="flex items-center justify-between">
        <div className="flex gap-x-2 items-center">
            <Image preview={false} width='50px' height='50px' className="object-cover rounded-lg" src={product.thumbnail ?? images.demoMenth} />
            <span className="font-semibold">{product.name}</span>
        </div>


        <div className="flex flex-col">
            <span className="text-[14px] text-primary font-semibold">{formatCurrencyVND(product.price)}</span>
            <span className="text-gray-500 text-[13px]">{formatCurrencyVND(product.oldPrice)}</span>
        </div>
    </Link>
};

export default SearchResultItem;
