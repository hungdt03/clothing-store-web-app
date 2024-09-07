import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect, useState } from "react";
import CardBorder from "../../admin/components/CardBorder";
import { faLocation, faPhone, faUser, faVoicemail } from "@fortawesome/free-solid-svg-icons";
import { Radio, RadioChangeEvent } from "antd";
import { AddressOrderResource } from "../../../resources";


type AddressOrderItemProps = {
    addressOrder: AddressOrderResource;
    onChange: (value: number) => void
}

const AddressOrderItem: FC<AddressOrderItemProps> = ({
    addressOrder,
    onChange
}) => {
    const [checked, setChecked] = useState(addressOrder.isDefault)

    const handleChange = async (e: RadioChangeEvent) => {
        if (!checked && e.target.checked) {
            onChange(addressOrder.id)
            setChecked(true)
        }
    }

    useEffect(() => {
        setChecked(addressOrder.isDefault)
    }, [addressOrder])

    return <CardBorder className="border-[1px] border-gray-200">
        <div className="flex items-center justify-between">
            <div className="flex gap-x-6 items-center">
                <FontAwesomeIcon icon={faLocation} />
                <div className="flex flex-col gap-y-2">
                    <p className="font-semibold text-xl">{addressOrder.address}</p>
                    <div className="flex gap-x-6 items-center flex-wrap">
                        <div className="flex gap-x-2 items-center text-gray-600">
                            <FontAwesomeIcon icon={faUser} />
                            <span>{addressOrder.fullName}</span>
                        </div>
                        <div className="flex gap-x-2 items-center text-gray-600">
                            <FontAwesomeIcon icon={faPhone} />
                            <span>{addressOrder.phoneNumber}</span>
                        </div>
                        <div className="flex gap-x-2 items-center text-gray-600">
                            <FontAwesomeIcon icon={faVoicemail} />
                            <span>{addressOrder.phoneNumber}</span>
                        </div>
                    </div>
                </div>
            </div>
            <Radio className="text-[16px]" onChange={handleChange} checked={checked} value={addressOrder.id}>Mặc định</Radio>
        </div>
    </CardBorder>
};

export default AddressOrderItem;
