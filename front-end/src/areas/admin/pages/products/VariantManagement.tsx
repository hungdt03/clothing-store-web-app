import { FC, useEffect, useState } from "react";
import { Button, Image, Modal, Popconfirm, Space, Table, message } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import useModal from "../../../../hooks/useModal";
import variantService from "../../../../services/variant-service";
import CreateVariantModal from "../../components/modals/CreateVariantModal";
import { ProductResource, VariantResource } from "../../../../resources";
import { Link } from "react-router-dom";
import TitleHeader from "../../components/TitleHeader";
import useDebounce from "../../../../hooks/useDebounce";
import images from "../../../../assets";


export type QueryParams = {
    pageIndex?: number;
    pageSize?: number;
    searchString?: string;
}

const initialValues: QueryParams = {
    pageIndex: 1,
    pageSize: 5,
    searchString: ''
}

type VariantManagementProps = {
    product: ProductResource
}

const VariantManagement: FC<VariantManagementProps> = ({
    product
}) => {
    const [variants, setVariants] = useState<VariantResource[]>([]);
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [queryParams, setQueryParams] = useState<QueryParams>(initialValues);
    const [total, setTotal] = useState(6)
    const debounceValue = useDebounce(queryParams.searchString, 600);

    const fetchVariants = async (params: QueryParams) => {
        const response = await variantService.getAllVariantsByProductId(product.id, params);
        setVariants(response.data);
        setTotal(response.pagination.totalItems)
    }

    const confirmRemove = async (id: number) => {
        try {
            await variantService.removeVariant(id)
            fetchVariants(queryParams)
            message.success('Xóa sản phẩm thành công');
        } catch {
            message.error('Xóa sản phẩm thất bại');
        }
    };


    const handleSubmit = () => {
        fetchVariants(queryParams);
        handleOk();
    }

    useEffect(() => {
        fetchVariants(queryParams)
    }, [debounceValue])

    const columns: TableProps<VariantResource>['columns'] = [
        {
            title: 'Ảnh',
            dataIndex: 'thumbnailUrl',
            key: 'thumbnailUrl',
            render(value) {
                return <Image onError={(e) => {
                    e.currentTarget.src = images.menCloth;
                }} src={value} preview={false} width='80px' height='80px' className="rounded-xl object-cover" />
            },
        },
        {
            title: 'Tồn kho',
            dataIndex: 'inStock',
            key: 'inStock',
        },
        {
            title: 'Kích cỡ',
            dataIndex: 'size',
            key: 'size',
            render(_, record) {
                return <span>{record.size.eSize}</span>
            },
        },
        {
            title: 'Màu sắc',
            dataIndex: 'color',
            key: 'color',
            render(_, record) {
                return <div className="flex items-center gap-x-2">
                    <span className="w-6 h-6 rounded-lg" style={{
                        backgroundColor: record.color.hexCode
                    }}></span>
                    <span>{record.color.name}</span>
                </div>
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn có chắc là muốn xóa biến thể này?"
                        onConfirm={() => confirmRemove(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                    <Link to={`/admin/variant/${record.id}`}>
                        <Button icon={<EyeOutlined />} type="default" size="small">Xem</Button>
                    </Link>
                </Space>
            ),
        },
    ];


    return <div className="bg-white shadow-sm rounded-lg p-6">
        <Table
            columns={columns}
            dataSource={variants}
            title={() => <TitleHeader onChange={value => {
                setQueryParams({
                    ...queryParams,
                    searchString: value,
                    pageIndex: 1
                })
            }} value={queryParams.searchString} callback={showModal} title="Biến thể sản phẩm" />}
            pagination={{
                align: "end",
                current: queryParams.pageIndex,
                onChange: (value) => {
                    const updateParams = {
                        ...queryParams,
                        pageIndex: value
                    }
                    setQueryParams(updateParams)
                    fetchVariants(updateParams)
                },
                showLessItems: true,
                pageSize: queryParams.pageSize,
                total: total
            }}
        />

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-semibold text-2xl">Thêm sản phẩm mới</p>}
            onCancel={handleCancel}
            width='800px'
            footer={[]}
        >
            <CreateVariantModal handleOk={handleSubmit} />
        </Modal>
    </div>
};

export default VariantManagement;
