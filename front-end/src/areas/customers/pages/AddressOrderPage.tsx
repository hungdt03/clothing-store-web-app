import { FC, useEffect, useState } from "react";
import {
    PlusOutlined
} from '@ant-design/icons';
import { Button, Empty, Modal, message } from "antd";
import useModal from "../../../hooks/useModal";
import CreateAddressOrderModal, { CreateAddressOrderRequest } from "../components/modals/CreateAddressOrderModal";
import { AddressOrderResource } from "../../../resources";
import addressOrderService from "../../../services/address-order-service";
import AddressOrderItem from "../components/AddressOrderItem";

const AddressOrderPage: FC = () => {

    const { isModalOpen, showModal, handleCancel, handleOk } = useModal()
    const [addressOrders, setAddressOrders] = useState<AddressOrderResource[]>([])

    const fetchAddressOrders = async () => {
        const response = await addressOrderService.getAllAddressOrders();
        
        setAddressOrders(response.data);
    }

    useEffect(() => {
        fetchAddressOrders();
    }, [])

    const handleSubmit = async (payload: CreateAddressOrderRequest, clearForm: () => void) => {
        const response = await addressOrderService.createAddressOrder(payload);
        console.log(response)
        if(response.success) {
            message.success(response.message)
            handleOk()
            clearForm()
            fetchAddressOrders()
        }
    }

    const handleChange = async (value: number) => {
        await addressOrderService.setStatusAddressOrder(value)
        fetchAddressOrders();

    }

    return <>
        <div className="flex flex-col gap-4 pt-6">
            <div className="flex justify-end">
                <Button onClick={showModal} icon={<PlusOutlined />} type="primary">Thêm mới</Button>
            </div>
            {
                addressOrders.length > 0 ? 
                addressOrders.map(addressOrder => <AddressOrderItem onChange={handleChange} key={addressOrder.id} addressOrder={addressOrder} />)
                : <Empty description='Chưa có địa chỉ giao hàng nào' />
            }
          
        </div>

        <Modal
            open={isModalOpen}
            onOk={handleOk}
            title={<p className="text-center font-semibold text-2xl">THÊM ĐỊA CHỈ MỚI</p>}
            onCancel={handleCancel}
            width='700px'
            footer={[]}
        >
            <CreateAddressOrderModal onSubmit={handleSubmit} />
        </Modal>
    </>
};

export default AddressOrderPage;
