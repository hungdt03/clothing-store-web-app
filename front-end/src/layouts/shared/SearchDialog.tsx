import { Divider, Input } from "antd";
import { FC, useCallback, useEffect, useState } from "react";
import SearchResultItem from "./SearchResultItem";
import { ProductResource } from "../../resources";
import useDebounce from "../../hooks/useDebounce";
import productService from "../../services/product-service";
import { QueryParams } from "../../areas/admin/pages/products/VariantManagement";

const initialValues: QueryParams = {
    pageSize: 10,
    pageIndex: 1,
    searchString: ''
}

const SearchDialog: FC = () => {
    const [params, setParams] = useState<QueryParams>(initialValues)
    const [searchResults, setSearchResults] = useState<ProductResource[]>([])
    const debounceValue = useDebounce(params.searchString, 600);

    const searchProducts = useCallback(async (queryParams: QueryParams) => {
        const response = await productService.searchProducts(queryParams)
        setSearchResults(response.data)
    }, [debounceValue]);

    useEffect(() => {
        if ((params.searchString ?? "").length >= 2)
            searchProducts(params);
    }, [debounceValue, searchProducts]);

    return <div className="p-2 min-w-[400px]">
        <Input value={params.searchString} onChange={e => setParams({
            ...params,
            searchString: e.target.value
        })} size="large" className="border-0" placeholder="Nhập từ khóa tìm kiếm" />
        {((params.searchString ?? "").length > 1 || searchResults.length > 0) && <>
            <Divider className="mb-2" />
            {searchResults.length > 0 ?
                (<span>Tìm thấy <b>{searchResults.length}</b> kết quả cho <b>{params.searchString}</b></span>)
                : 'Không tìm thấy kết quả nào'
            }
            <Divider className="mt-2" />
        </>}
        <div className="flex flex-col gap-y-4 pr-4 w-full max-h-[400px] overflow-y-auto custom-scrollbar scrollbar-h-4">
            {searchResults.map(product => <SearchResultItem key={product.id} product={product} />)}
        </div>
    </div>
};

export default SearchDialog;
