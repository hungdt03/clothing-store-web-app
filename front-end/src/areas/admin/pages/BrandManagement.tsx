import { FC, useEffect, useState } from "react";
import { Button, Modal, Popconfirm, Space, Table, message } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useModal from "../../../hooks/useModal";
import { BrandResource } from "../../../resources";
import CreateBrandModal from "../components/modals/CreateBrandModal";
import brandService from "../../../services/brand-service";
import EditBrandModal from "../components/modals/EditBrandModal";
import TitleHeader from "../components/TitleHeader";
import { QueryParams } from "./products/VariantManagement";
import useDebounce from "../../../hooks/useDebounce";

const intitialValues: QueryParams = {
    pageIndex: 1,
    pageSize: 8,
    searchString: ''
}

const BrandManagement: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const { isModalOpen: isEditModalOpen, handleCancel: edithandleCancel, handleOk: edithandleOk, showModal: editshowModal } = useModal()
    const [brand, setBrand] = useState<BrandResource | null>(null)
    const [brands, setBrands] = useState<BrandResource[]>([]);
    const [queryParams, setQueryParams] = useState<QueryParams>(intitialValues)
    const [total, setTotal] = useState(8)
    const debounceValue = useDebounce(queryParams.searchString, 600)

    const fetchBrands = async (params: QueryParams) => {
        const response = await brandService.getAllBrands(params);
        setBrands(response.data)
        setTotal(response.pagination.totalItems)
    }

    const confirmRemove = async (id: number) => {
        await brandService.removeBrand(id)
        fetchBrands(queryParams)
        message.success('Xóa nhãn hiệu thành công');
    };

    const handleSubmit = () => {
        edithandleOk();
        handleOk();
        fetchBrands(queryParams)
    }


    useEffect(() => {
        fetchBrands(queryParams)
    }, [debounceValue]);


    const columns: TableProps<BrandResource>['columns'] = [
        {
            title: 'Tên thương hiệu',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
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
                    <Button onClick={() => {
                        setBrand(record)
                        editshowModal()
                    }} icon={<EditOutlined />} danger type="dashed" size="small">Sửa</Button>
                </Space>
            ),
        },
    ];


    return <div className="bg-white shadow-sm rounded-lg p-6">
        <Table
            columns={columns}
            dataSource={brands}
            rowKey='id'
            title={() => <TitleHeader onChange={value => {
                setQueryParams({
                    ...queryParams,
                    searchString: value,
                    pageIndex: 1
                })
            }} value={queryParams.searchString} title="Nhãn hiệu" callback={showModal} />}
            pagination={{
                pageSize: queryParams.pageSize,
                current: queryParams.pageIndex,
                onChange: (value) => {
                    const updateParams = {
                        ...queryParams,
                        pageIndex: value,
                    }
                    setQueryParams(updateParams)
                    fetchBrands(updateParams)
                },
                align: 'end',
                showLessItems: true,
                total: total
            }}
        />

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-semibold text-2xl">Thêm nhãn hiệu mới</p>}
            onCancel={handleCancel}
            footer={[]}
        >
            <CreateBrandModal handleOk={handleSubmit} />
        </Modal>

        <Modal
            open={isEditModalOpen}
            onOk={edithandleOk}
            title={<p className="text-center font-semibold text-2xl">Cập nhật nhãn hiệu</p>}
            onCancel={edithandleCancel}
            footer={[]}
        >
            <EditBrandModal brand={brand!} handleOk={handleSubmit} />
        </Modal>
    </div>
};

export default BrandManagement;