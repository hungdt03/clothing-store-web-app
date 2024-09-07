import { FC, useEffect, useState } from "react";
import { Button, Form, FormProps, Input, Radio, Select } from "antd";
import addressService, { AddressOption } from "../../../../services/address-service";

export type CreateAddressOrderRequest = {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    isDefault: boolean;
}

type AddressOrderType = {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    village: string;
    isDefault: boolean;
};

type CreateAddressOrderModalProps = {
    onSubmit: (payload: CreateAddressOrderRequest, clearForm: () => void) => void
}

const CreateAddressOrderModal: FC<CreateAddressOrderModalProps> = ({
    onSubmit,
}) => {

    const [provinces, setProvinces] = useState<AddressOption[]>([])
    const [districts, setDistricts] = useState<AddressOption[]>([])
    const [wards, setWards] = useState<AddressOption[]>([])
    const [addressList, setAddressList] = useState(['', '', '', ''])
    const [form] = Form.useForm<AddressOrderType>();

    const onFinish: FormProps<AddressOrderType>['onFinish'] = (values) => {
        console.log(values)
        const payload : CreateAddressOrderRequest = {
            address: values.address,
            email: values.email,
            fullName: values.fullName,
            isDefault: values.isDefault,
            phoneNumber: values.phoneNumber
        }

        onSubmit(payload, form.resetFields)
    };

    const fetchProvinces = async () => {
        const response = await addressService.getProvinces();
        setProvinces(response)
    }

    const fetchDistricts = async (provinceId: string) => {
        const response = await addressService.getDistrictsByProvinceId(provinceId);
        setDistricts(response)
    }

    const fetchWards = async (districtId: string) => {
        const response = await addressService.getWardsByDistrictId(districtId);
        setWards(response)
    }

    useEffect(() => {
        fetchProvinces()
    }, [])

    const handleProvinceChange = (provinceId: string, option: AddressOption | AddressOption[]) => {
        if (Array.isArray(option)) {
            return;
        }

        const newList = ['', '', '', option.label]
        setAddressList([...newList])

        form.setFieldValue('address', newList.filter(item => item).join(', '))
        form.setFieldValue('province', provinceId)
        form.setFieldValue('district', null)
        form.setFieldValue('ward', null)
        fetchDistricts(provinceId);
    }

    const handleDistrictChange = (districtId: string, option: AddressOption | AddressOption[]) => {
        if (Array.isArray(option)) {
            return;
        }

        addressList[2] = option.label
        addressList[0] = addressList[1] = ''
        setAddressList([...addressList])

        form.setFieldValue('address', addressList.filter(item => item).join(', '))
        form.setFieldValue('district', districtId)
        form.setFieldValue('ward', null)
        fetchWards(districtId);
    }

    const handleWardChange = (wardId: string, option: AddressOption | AddressOption[]) => {
        if (Array.isArray(option)) {
            return;
        }

        addressList[1] = option.label
        addressList[0] = ''
        setAddressList([...addressList])

        form.setFieldValue('address', addressList.filter(item => item).join(', '))
        form.setFieldValue('ward', wardId)
    }

    const handleVillageChange = (value: string) => {
        addressList[0] = value
        setAddressList([...addressList])
        form.setFieldValue('address', addressList.filter(item => item).join(', '))
        form.setFieldValue('village', value)
    }

    return <div className="max-h-[500px] px-4 overflow-y-auto custom-scrollbar scrollbar-h-4">
        <Form
            form={form}
            name="basic"
            initialValues={{
                isDefault: false
            }}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
        >
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item<AddressOrderType>
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input placeholder="Nhập họ và tên" size="large" />
                </Form.Item>
                <Form.Item<AddressOrderType>
                    label="Số điện thoại liên hệ"
                    name="phoneNumber"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input placeholder="Nhập số điện thoại" size="large" />
                </Form.Item>
                <Form.Item<AddressOrderType>
                    label="Địa chỉ email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email!' }]}
                >
                    <Input placeholder="Nhập địa chỉ email" size="large" />
                </Form.Item>

                <Form.Item<AddressOrderType>
                    label="Tỉnh / thành"
                    name="province"
                    rules={[{ required: true, message: 'Vui lòng chọn tỉnh / thành!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn tỉnh / thành"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleProvinceChange}
                        options={provinces}
                    />
                </Form.Item>
                <Form.Item<AddressOrderType>
                    label="Quận / huyện"
                    name="district"
                    rules={[{ required: true, message: 'Vui lòng chọn quận / huyện!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn quận / huyện"
                        disabled={!form.getFieldValue('province')}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleDistrictChange}
                        options={districts}
                    />
                </Form.Item>
                <Form.Item<AddressOrderType>
                    label="Phường / xã"
                    name="ward"
                    rules={[{ required: true, message: 'Vui lòng chọn phường / xã!' }]}
                >
                    <Select
                        showSearch
                        disabled={!form.getFieldValue('district')}
                        placeholder="Chọn phường / xã"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleWardChange}
                        options={wards}
                    />
                </Form.Item>
                <Form.Item<AddressOrderType>
                    label="Đường / Thôn / Xóm"
                    name="village"
                    rules={[{ required: true, message: 'Vui lòng nhập đường / thôn / xóm ...!' }]}
                >
                    <Input disabled={!form.getFieldValue('ward')} onChange={e => handleVillageChange(e.target.value)} size="large" />
                </Form.Item>
                <Form.Item<AddressOrderType>
                    label="Địa chỉ giao hàng"
                    name="address"
                >
                    <Input.TextArea maxLength={3} readOnly size="large" />
                </Form.Item>
                <Form.Item<AddressOrderType>
                    label="Đặt làm mặc định"
                    name="isDefault"
                >
                    <Radio onChange={(e) => form.setFieldValue('isDefault', e.target.checked)} value={form.getFieldValue('isDefault')}></Radio>
                </Form.Item>
            </div>

            <div className="mt-4 flex justify-end">
                <Form.Item>
                    <Button size="large" type="primary" htmlType="submit">
                        Lưu lại
                    </Button>
                </Form.Item>
            </div>
        </Form>
    </div>
};

export default CreateAddressOrderModal;
