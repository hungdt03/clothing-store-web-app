import { FC, useEffect, useState } from "react";
import { Button, Drawer, Image, Modal, Popconfirm, Space, Table, message } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import productService from "../../../../services/product-service";
import useModal from "../../../../hooks/useModal";
import CreateProductModal from "../../components/modals/CreateProductModal";
import { Link } from "react-router-dom";
import { ProductResource } from "../../../../resources";
import { formatCurrencyVND } from "../../../../utils/format";
import TitleHeader from "../../components/TitleHeader";
import { ProductFilter } from "../../../customers/pages/ShopPage";
import AdvancedFilter from "../../../shared/AdvancedFilter";
import SortSelection from "../../../shared/SortSelection";
import useDebounce from "../../../../hooks/useDebounce";
import { QueryParams } from "./VariantManagement";

const intitialValues: ProductFilter = {
    pageIndex: 1,
    pageSize: 6,
}

const searchQueryInitialValue: QueryParams = {
    pageIndex: 1,
    pageSize: 6,
    searchString: ''
}

const ProductManagement: FC = () => {
    const [products, setProducts] = useState<ProductResource[]>([]);
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [queryParams, setQueryParams] = useState<ProductFilter>(intitialValues)
    const [searchQuery, setSearchQuery] = useState<QueryParams>(searchQueryInitialValue)
    const [total, setTotal] = useState(6)
    const [open, setOpen] = useState(false);
    const debounceValue = useDebounce(searchQuery.searchString, 600)
    const [isSearch, setIsSearch] = useState(false)

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };


    const fetchProducts = async (params: ProductFilter) => {
        const response = await productService.getAllProducts(params);
        setProducts(response.data);
        setTotal(response.pagination.totalItems)
        setIsSearch(false)
    }

    useEffect(() => {
        fetchProducts(queryParams);
    }, [queryParams])

    const searchProducts = async (params: QueryParams) => {
        const response = await productService.searchProducts(params);
        setProducts(response.data)
        setTotal(response.pagination.totalItems)
        setIsSearch(true)
    }

    useEffect(() => {
        searchProducts(searchQuery)
    }, [debounceValue])


    const handleSubmit = () => {
        fetchProducts(queryParams);
        handleOk();
    }

    const columns: TableProps<ProductResource>['columns'] = [
        {
            title: 'Ảnh',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render(value) {
                return <Image src={value} preview={false} width='80px' height='80px' className="rounded-xl object-cover" />
            },
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Giá cũ',
            dataIndex: 'oldPrice',
            key: 'oldPrice',
            render(value) {
                return formatCurrencyVND(value)
            }
        },
        {
            title: 'Giá hiện tại',
            dataIndex: 'price',
            key: 'price',
            render(value) {
                return formatCurrencyVND(value)
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Xóa thương hiệu"
                        description="Bạn có chắc là muốn xóa thương hiệu?"
                        onConfirm={() => confirmRemove(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                    <Link to={`/admin/product/${record.id}`}><Button icon={<EyeOutlined />} type="default" size="small">Chi tiết</Button></Link>
                </Space>
            ),
        },
    ];

    const confirmRemove = async (id: number) => {
        await productService.removeProduct(id)
        fetchProducts(queryParams)
        message.success('Xóa sản phẩm thành công');
    };

    return <div className="bg-white shadow-sm rounded-lg p-6">
        <Table
            columns={columns}
            dataSource={products}
            rowKey='id'
            title={() => <TitleHeader 
                isShowFilterBtn 
                title="Sản phẩm" 
                callback={showModal}
                value={searchQuery.searchString}
                onChange={value => setSearchQuery({
                    ...searchQuery,
                    searchString: value
                })}
                onFilterClick={showDrawer}
                isShowSortSelection={true}
                sortSelection={<SortSelection
                    queryParams={queryParams}
                    onChange={params => setQueryParams({
                        ...queryParams,
                        ...params,
                        pageIndex: 1
                    })}    
                />}
            />}
            pagination={{
                pageSize: isSearch ? searchQuery.pageSize : queryParams.pageSize,
                current: isSearch ? searchQuery.pageIndex : queryParams.pageIndex,
                onChange: (value) => {
                    if(isSearch) {
                        const updatedSearchQuery = {
                            ...searchQuery,
                            pageIndex: value
                        }
                        setSearchQuery(updatedSearchQuery)
                        searchProducts(updatedSearchQuery)

                    } else {
                        setQueryParams({
                            ...queryParams,
                            pageIndex: value
                        })
                    }
                },
                align: 'end',
                showLessItems: true,
                total: total
            }}
        />

        <Drawer title="LỌC NÂNG CAO" onClose={onClose} open={open}>
            <AdvancedFilter
                queryParams={queryParams}
                onChange={(params) => setQueryParams({
                    ...queryParams,
                    ...params,
                    pageIndex: 1
                })}
            />
        </Drawer>

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-semibold text-2xl">Thêm sản phẩm mới</p>}
            onCancel={handleCancel}
            width='800px'
            footer={[]}
        >
            <CreateProductModal handleOk={handleSubmit} />
        </Modal>
    </div>
};

export default ProductManagement;
