import { FC, useEffect, useState } from "react";
import { Button, Modal, Popconfirm, Rate, Space, Table, message } from 'antd';
import type { TableProps } from 'antd';
import {DeleteOutlined } from '@ant-design/icons';
import useModal from "../../../../hooks/useModal";
import { ReviewShowResource } from "../../../../resources";
import TitleHeader from "../../components/TitleHeader";
import settingService from "../../../../services/setting-service";
import CreateReviewShowModal from "../../components/modals/CreateReviewShowModal";



const ReviewShowManagement: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const [reviewShows, setReviewShows] = useState<ReviewShowResource[]>([]);

    const fetchReviewShows = async () => {
        const response = await settingService.getAllReviewShows();
        setReviewShows(response.data)
    }

    const confirmRemove = async (id: number) => {
        try {
            await settingService.removeReviewShow(id)
            fetchReviewShows()
            message.success('Xóa top review thành công');
        } catch {
            message.error('Xóa top review thất bại');
        }
        
        
    };

    useEffect(() => {
        fetchReviewShows();
    }, [])

    const handleSubmit = () => {
        handleOk();
        fetchReviewShows()
    }


    const columns: TableProps<ReviewShowResource>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nội dụng',
            dataIndex: 'content',
            key: 'content',
            render(_, record) {
                return <p className="max-w-[400px] line-clamp-2">{record.evaluation.content}</p>
            }
        },
        {
            title: 'Số sao',
            dataIndex: 'stars',
            key: 'stars',
            render(_, record) {
                return <Rate className="text-sm" disabled value={record.evaluation.stars} />
            }
        },
        {
            title: 'Người đánh giá',
            dataIndex: 'user',
            key: 'user',
            render(_, record) {
                return record.evaluation.user?.name
            }
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
                </Space>
            ),
        },
    ];


    return <div className="bg-white shadow-sm rounded-lg p-6">
        <div>
            <Table
                columns={columns}
                dataSource={reviewShows}
                rowKey='id'
                title={() => <TitleHeader title="Slide show" callback={showModal} />}
                pagination={{
                    pageSize: 8,
                }}
            />

            <Modal
                open={isModalOpen}
                onOk={handleOk}
                title={<p className="text-center font-semibold text-2xl">Thêm đánh giá mới</p>}
                onCancel={handleCancel}
                footer={[]}
            >
                <CreateReviewShowModal handleOk={handleSubmit} />
            </Modal>
        
        </div>
    </div>
};

export default ReviewShowManagement;