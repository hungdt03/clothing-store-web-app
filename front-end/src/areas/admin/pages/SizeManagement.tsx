import { FC, useEffect, useState } from "react";
import { Button, Modal, Popconfirm, Space, Table, message } from 'antd';
import type { PopconfirmProps, TableProps } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useModal from "../../../hooks/useModal";
import {  SizeResource } from "../../../resources";
import sizeService from "../../../services/size-service";
import CreateSizeModal from "../components/modals/CreateSizeModal";
import EditSizeModal from "../components/modals/EditSizeModal";
import TitleHeader from "../components/TitleHeader";




const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    message.success('Click on Yes');
};

const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    message.error('Click on No');
};



const SizeManagement: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [sizes, setSizes] = useState<SizeResource[]>([]);
    const { isModalOpen: isEditModalOpen, handleCancel: edithandleCancel, handleOk: edithandleOk, showModal: editshowModal } = useModal()
    const [size, setSize] = useState<SizeResource | null>(null)

    const fetchSizes = async () => {
        const response = await sizeService.getAllSizes();
        setSizes(response.data)
    }

    useEffect(() => {
        fetchSizes();
    }, [])

    const handleSubmit = () => {
        handleOk();
        edithandleOk();
        fetchSizes()
    }

    const columns: TableProps<SizeResource>['columns'] = [
        {
            title: 'Kích cỡ',
            dataIndex: 'eSize',
            key: 'eSize',
        },
        {
            title: 'Chiều cao tối thiểu',
            dataIndex: 'minHeight',
            key: 'minHeight',
        },
        {
            title: 'Chiều cao tối đa',
            dataIndex: 'maxHeight',
            key: 'maxHeight',
        },
        {
            title: 'Câng nặng tối thiểu',
            dataIndex: 'minWeight',
            key: 'minWeight',
        },
        {
            title: 'Câng nặng tối đa',
            dataIndex: 'maxWeight',
            key: 'maxWeight',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Xóa kích cỡ"
                        description="Bạn có chắc là muốn xóa kích cỡ?"
                        onConfirm={() => confirmRemove(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                    <Button onClick={() => {
                            setSize(record)
                            editshowModal()
                        }} icon={<EditOutlined />} danger type="dashed" size="small">Sửa</Button>
                </Space>
            ),
        },
    ];

    const confirmRemove = async (id: number) => {
        await sizeService.removeSize(id)
        fetchSizes()
        message.success('Xóa kích cỡ thành công');
    };

    return <div className="bg-white shadow-sm rounded-lg p-6">
        <div>
            <Table
                columns={columns}
                dataSource={sizes}
                rowKey='id'
                title={() => <TitleHeader title="Kích cỡ" callback={showModal} />}
                pagination={{
                    pageSize: 8, 
                }}
            />

            <Modal
                open={isModalOpen}
                onOk={handleOk}
                title={<p className="text-center font-semibold text-2xl">Thêm kích cỡ mới</p>}
                onCancel={handleCancel}
                footer={[]}
            >
                <CreateSizeModal handleOk={handleSubmit} />
            </Modal>

            <Modal
                open={isEditModalOpen}
                onOk={edithandleOk}
                title={<p className="text-center font-semibold text-2xl">Cập nhật kích cỡ</p>}
                onCancel={edithandleCancel}
                footer={[]}
            >
                <EditSizeModal size={size!} handleOk={handleSubmit} />
            </Modal>
        </div>
    </div>
};

export default SizeManagement;