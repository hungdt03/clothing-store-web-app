import { FC } from "react";
import { AddressOrderResource } from "../../../resources";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faUser, faVoicemail } from "@fortawesome/free-solid-svg-icons";

type AddressRadioItemProps = {
    address: AddressOrderResource;
}

const AddressRadioItem: FC<AddressRadioItemProps> = ({
    address
}) => {
    return <div className="px-5 flex gap-x-6 items-center">
        <div className="flex flex-col gap-y-2">
            <p className="font-semibold text-[16px] text-gray-600">{address.address}</p>
            <div className="flex gap-x-6 items-center flex-wrap">
                <div className="flex gap-x-2 items-center text-gray-600">
                    <FontAwesomeIcon icon={faUser} />
                    <span>{address.fullName}</span>
                </div>
                <div className="flex gap-x-2 items-center text-gray-600">
                    <FontAwesomeIcon icon={faPhone} />
                    <span>{address.phoneNumber}</span>
                </div>
                <div className="flex gap-x-2 items-center text-gray-600">
                    <FontAwesomeIcon icon={faVoicemail} />
                    <span>{address.phoneNumber}</span>
                </div>
            </div>
        </div>
    </div>
};

export default AddressRadioItem;
