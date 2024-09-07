import { FC, useEffect, useState } from "react";
import { Button, Modal, Popconfirm, Space, Table, message } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useModal from "../../../hooks/useModal";
import { ColorResource } from "../../../resources";
import colorService from "../../../services/color-service";
import CreateColorModal from "../components/modals/CreateColorModal";
import EditColorModal from "../components/modals/EditColorModal";
import TitleHeader from "../components/TitleHeader";


const ColorManagement: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [colors, setColors] = useState<ColorResource[]>([]);
    const { isModalOpen: isEditModalOpen, handleCancel: edithandleCancel, handleOk: edithandleOk, showModal: editshowModal } = useModal()
    const [color, setColor] = useState<ColorResource | null>(null)

    const fetchColors = async () => {
        const response = await colorService.getAllColors();
        setColors(response.data)
    }

    useEffect(() => {
        fetchColors();
    }, [])

    const handleSubmit = () => {
        handleOk();
        edithandleOk();
        fetchColors()
    }

    const confirmRemove = async (id: number) => {
        await colorService.removeColor(id)
        fetchColors()
        message.success('Xóa màu sắc thành công');
    };


    const columns: TableProps<ColorResource>['columns'] = [
        {
            title: 'Tên màu sắc',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mã màu',
            dataIndex: 'hexCode',
            key: 'hexCode',
        },
        {
            title: 'Màu hiển thị',
            dataIndex: 'showColor',
            key: 'showColor',
            render: (_, record) => (
                <div className="w-6 h-6 rounded-lg" style={{
                    backgroundColor: record.hexCode
                }}></div>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Xóa màu sắc"
                        description="Bạn có chắc là muốn xóa màu sắc?"
                        onConfirm={() => confirmRemove(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                    <Button onClick={() => {
                        setColor(record)
                        editshowModal()
                    }} icon={<EditOutlined />} danger type="dashed" size="small">Sửa</Button>
                </Space>
            ),
        },
    ];


    return <div className="bg-white shadow-sm rounded-lg p-6">
        <div>
            <Table
                columns={columns}
                dataSource={colors}
                rowKey='id'
                title={() => <TitleHeader title="Màu sắc" callback={showModal} />}
                pagination={{
                    pageSize: 8,
                }}
            />

            <Modal
                open={isModalOpen}
                onOk={handleOk}
                title={<p className="text-center font-semibold text-2xl">Thêm màu sắc mới</p>}
                onCancel={handleCancel}
                footer={[]}
            >
                <CreateColorModal handleOk={handleSubmit} />
            </Modal>

            <Modal
                open={isEditModalOpen}
                onOk={edithandleOk}
                title={<p className="text-center font-semibold text-2xl">Cập nhật màu sắc</p>}
                onCancel={edithandleCancel}
                footer={[]}
            >
                <EditColorModal color={color!} handleOk={handleSubmit} />
            </Modal>
        </div>
    </div>
};

export default ColorManagement;