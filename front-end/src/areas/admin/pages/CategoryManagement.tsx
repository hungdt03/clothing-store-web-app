import { FC, useEffect, useState } from "react";
import { Button, Modal, Popconfirm, Space, Table, message } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useModal from "../../../hooks/useModal";
import CreateCategoryModal from "../components/modals/CreateCategoryModal";
import { CategoryResource } from "../../../resources";
import categoryService from "../../../services/category-service";
import EditCategoryModal from "../components/modals/EditCategoryModal";
import TitleHeader from "../components/TitleHeader";
import { QueryParams } from "./products/VariantManagement";
import useDebounce from "../../../hooks/useDebounce";


const initialValues: QueryParams = {
    pageIndex: 1,
    pageSize: 8,
    searchString: ''
}

const CategoryManagement: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const { isModalOpen: isEditModalOpen, handleCancel: edithandleCancel, handleOk: edithandleOk, showModal: editshowModal } = useModal()
    const [categories, setCategories] = useState<CategoryResource[]>([]);
    const [category, setCategory] = useState<CategoryResource | null>(null)

    const [queryParams, setQueryParams] = useState<QueryParams>(initialValues);
    const debounceValue = useDebounce(queryParams.searchString, 600);
    const [total, setTotal] = useState(8)

    const columns: TableProps<CategoryResource>['columns'] = [
        {
            title: 'Tên danh mục',
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
                        title="Xóa danh mục"
                        description="Bạn có chắc là muốn xóa danh mục?"
                        onConfirm={() => confirmRemove(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                    <Button onClick={() => {
                        setCategory(record)
                        editshowModal()
                    }} icon={<EditOutlined />} danger type="dashed" size="small">Sửa</Button>
                </Space>
            ),
        },
    ];

    const fetchCategories = async (params: QueryParams) => {
        const response = await categoryService.getAllCategories(params);
        setCategories(response.data)
        setTotal(response.pagination.totalItems)
    }

    const confirmRemove = async (id: number) => {
        await categoryService.removeCategory(id)
        fetchCategories(queryParams)
        message.success('Xóa nhãn hiệu thành công');
    };

    useEffect(() => {
        fetchCategories(queryParams);
    }, [debounceValue])

    const handleSubmit = () => {
        handleOk();
        edithandleOk();
        fetchCategories(queryParams)
    }



    return <div className="bg-white shadow-sm rounded-lg p-6">
        <div>
            <Table
                columns={columns}
                dataSource={categories}
                rowKey='id'
                title={() => <TitleHeader onChange={value => {
                    setQueryParams({
                        ...queryParams,
                        searchString: value,
                        pageIndex: 1
                    })
                    
                }} value={queryParams.searchString} title="Danh mục" callback={showModal} />}
                pagination={{
                    pageSize: queryParams.pageSize,
                    current: queryParams.pageIndex,
                    onChange: (value) => {
                        const updateParams = {
                            ...queryParams,
                            pageIndex: value
                        }
                        setQueryParams(updateParams)
                        fetchCategories(updateParams)
                    },
                    align: 'end',
                    showLessItems: true,
                    total: total
                }}
            />

            <Modal
                open={isModalOpen}
                onOk={handleOk}
                title={<p className="text-center font-semibold text-2xl">Thêm danh mục mới</p>}
                onCancel={handleCancel}
                footer={[]}
            >
                <CreateCategoryModal categories={categories} handleOk={handleSubmit} />
            </Modal>

            <Modal
                open={isEditModalOpen}
                onOk={edithandleOk}
                title={<p className="text-center font-semibold text-2xl">Cập nhật danh mục</p>}
                onCancel={edithandleCancel}
                footer={[]}
            >
                <EditCategoryModal category={category!} categories={categories} handleOk={handleSubmit} />
            </Modal>
        </div>
    </div>
};

export default CategoryManagement;