import { FC, useEffect, useState } from "react";
import { Button, Image, Modal, Popconfirm, Space, Table, Tag, message } from 'antd';
import type { TableProps } from 'antd';
import { UnlockOutlined, LockOutlined, EditOutlined } from '@ant-design/icons';
import useModal from "../../../hooks/useModal";
import { UserResource } from "../../../resources";
import accountService from "../../../services/user-service";
import images from "../../../assets";
import TitleHeader from "../components/TitleHeader";
import CreateAccountModal from "../components/modals/CreateAccountModal";
import EditAccountModal from "../components/modals/EditAccountModal";
import { QueryParams } from "./products/VariantManagement";
import useDebounce from "../../../hooks/useDebounce";

const getTagColor = (roleName: string) : string => {
    if(roleName === "ADMIN") return 'pink'
    return 'green'
}

const initialValues: QueryParams = {
    pageIndex: 1,
    pageSize: 6,
    searchString: ''
}

const AccountManagement: FC = () => {
    const { isModalOpen, handleCancel, handleOk, showModal } = useModal()
    const { isModalOpen: isEditModalOpen, handleCancel: edithandleCancel, handleOk: edithandleOk, showModal: editshowModal } = useModal()
    const [account, setAccount] = useState<UserResource | null>(null)
    const [accounts, setAccounts] = useState<UserResource[]>([]);
    const [params, setParams] = useState<QueryParams>(initialValues)
    const [total, setTotal] = useState(6)
    const debounceValue = useDebounce(params.searchString, 600)

    const fetchAccounts = async (query: QueryParams) => {
        const response = await accountService.getAllAccounts(query);
        setAccounts(response.data)
        setTotal(response.pagination.totalItems)
    }

    const confirmLock = async (id: string) => {
        const isFailure = await accountService.lockAccount(id);
        if(isFailure) {
            message.error(isFailure.message)
        } else {
            message.success('Khóa tài khoản thành công')
            fetchAccounts(params)
        }
    };

    const confirmUnlock = async (id: string) => {
        const isFailure = await accountService.unlock(id);

        if(isFailure) {
            message.error(isFailure.message)
        } else {
            message.success('Bỏ khóa tài khoản thành công')
            fetchAccounts(params)
        }
       
    };

    useEffect(() => {
        fetchAccounts(params);
    }, [debounceValue])

    const handleSubmit = () => {
        edithandleOk();
        handleOk();
        fetchAccounts(params)
    }


    const columns: TableProps<UserResource>['columns'] = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            key: 'avatar',
            render(value) {
                return <Image preview={false} width='60px' height='60px' className="object-cover rounded-lg" src={value ?? images.menCloth} />
            }
        },
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Địa chỉ email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Quyền truy cập',
            dataIndex: 'roles',
            key: 'roles',
            render(value: string[]) {
                return value.map(item => <Tag className="text-[10px] cursor-pointer" color={getTagColor(item)} key={item}>{item}</Tag>)
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                   
                    {record.isLocked ? <Popconfirm
                        title="Bỏ khóa tài khoản"
                        description="Bạn có chắc là muốn bỏ khóa tài khoản?"
                        onConfirm={() => confirmUnlock(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<UnlockOutlined />} danger type="primary" size="small">Bỏ khóa</Button>
                    </Popconfirm> : <Popconfirm
                        title="Khóa tài khoản"
                        description="Bạn có chắc là muốn khóa tài khoản?"
                        onConfirm={() => confirmLock(record.id)}
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                    >
                        <Button icon={<LockOutlined />} danger type="primary" size="small">Khóa</Button>
                    </Popconfirm>}

                    <Button onClick={() => {
                        setAccount(record)
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
                dataSource={accounts}
                rowKey='id'
                title={() => <TitleHeader onChange={value => setParams({
                    ...params, 
                    pageIndex: 1,
                    searchString: value
                })} title="Tài khoản" callback={showModal} />}
                pagination={(total > params.pageSize!) ? {
                    pageSize: params.pageSize,
                    current: params.pageIndex,
                    onChange: (value) => {
                        const updateParams = {
                            ...params,
                            pageIndex: value,
                        }
                        setParams(updateParams)
                        fetchAccounts(updateParams)
                    },
                    total: total,
                    showLessItems: true,
                    align: 'end',
                } : false}
            />

            <Modal
                open={isModalOpen}
                onOk={handleOk}
                title={<p className="text-center font-semibold text-2xl">Thêm tài khoản mới</p>}
                onCancel={handleCancel}
                footer={[]}
            >
                <CreateAccountModal handleOk={handleSubmit} />
            </Modal>

            <Modal
                open={isEditModalOpen}
                onOk={edithandleOk}
                title={<p className="text-center font-semibold text-2xl">Cập nhật thông tin tài khoản</p>}
                onCancel={edithandleCancel}
                footer={[]}
            >
                <EditAccountModal user={account!} handleOk={handleSubmit} />
            </Modal>
        </div>
    </div>
};

export default AccountManagement;