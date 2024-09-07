import { FC, useEffect, useState } from "react";
import { Button, Image, Modal, Popconfirm, Space, Table, message } from 'antd';
import type { TableProps } from 'antd';
import {DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useModal from "../../../../hooks/useModal";
import { SlideShowResource } from "../../../../resources";
import TitleHeader from "../../components/TitleHeader";
import settingService from "../../../../services/setting-service";
import CreateSlideShowModal from "../../components/modals/CreateSlideShowModal";
import EditSlideShowModal from "../../components/modals/EditSlideShowModal";



const SlideShowManagement: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const { isModalOpen: isEditModalOpen, handleCancel: edithandleCancel, handleOk: edithandleOk, showModal: editshowModal } = useModal()
    const [slideShow, setSlideShow] = useState<SlideShowResource | null>(null)
    const [slideShows, setSlideShows] = useState<SlideShowResource[]>([]);

    const fetchSlideShows = async () => {
        const response = await settingService.getAllSlideShows();
        setSlideShows(response.data)
    }

    const confirmRemove = async (id: number) => {
        await settingService.removeSlideShow(id)
        fetchSlideShows()
        message.success('Xóa nhãn hiệu thành công');
    };

    useEffect(() => {
        fetchSlideShows();
    }, [])

    const handleSubmit = () => {
        edithandleOk();
        handleOk();
        fetchSlideShows()
    }


    const columns: TableProps<SlideShowResource>['columns'] = [
        {
            title: 'Hình nền',
            dataIndex: 'backgroundImage',
            key: 'backgroundImage',
            render(value) {
                return <Image preview={false} src={value} className="rounded-lg object-cover" width='120px' height='80px' />
            }
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Tiêu đề nút',
            dataIndex: 'btnTitle',
            key: 'btnTitle',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Xóa slide show"
                        description="Bạn có chắc là muốn xóa slide show?"
                        onConfirm={() => confirmRemove(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                    <Button onClick={() => {
                        setSlideShow(record)
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
                dataSource={slideShows}
                rowKey='id'
                title={() => <TitleHeader title="Slide show" callback={showModal} />}
                pagination={{
                    pageSize: 8,
                }}
            />

            <Modal
                open={isModalOpen}
                onOk={handleOk}
                title={<p className="text-center font-semibold text-2xl">Thêm slide show mới</p>}
                onCancel={handleCancel}
                footer={[]}
            >
                <CreateSlideShowModal handleOk={handleSubmit} />
            </Modal>

            <Modal
                open={isEditModalOpen}
                onOk={edithandleOk}
                title={<p className="text-center font-semibold text-2xl">Cập nhật slide show</p>}
                onCancel={edithandleCancel}
                footer={[]}
            >
                <EditSlideShowModal slideShow={slideShow!} handleOk={handleSubmit} />
            </Modal>
        </div>
    </div>
};

export default SlideShowManagement;