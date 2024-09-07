import { FC, useEffect, useState } from "react";
import { ColorResource, ProductResource, SizeResource, VariantResource } from "../../../../resources";
import productService from "../../../../services/product-service";
import { Button, Image, Tooltip, message } from "antd";
import { formatCurrencyVND } from "../../../../utils/format";
import { ShoppingCartOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { AppDispatch } from "../../../../app/store";
import { useDispatch } from "react-redux";
import variantService from "../../../../services/variant-service";
import { CartItemPayload, addNewOrIncreaseQuantity } from "../../../../feature/cart/cartSlice";
import GroupColorRadio from "../GroupColorRadio";
import GroupSizeRadio from "../GroupSizeRadio";
import QuantityButton from "../QuantityButton";
import { Link } from "react-router-dom";

type QuickViewModalProps = {
    productId: number
}

const QuickViewModal: FC<QuickViewModalProps> = ({
    productId
}) => {

    const [product, setProduct] = useState<ProductResource | null>(null)
    const [variants, setVariants] = useState<VariantResource[]>([]);
    const [uniqueSizeVariants, setUniqueSizeVariants] = useState<VariantResource[]>([])
    const [color, setColor] = useState<ColorResource | null>()
    const [size, setSize] = useState<SizeResource | null>()
    const [count, setCount] = useState(1)
    const [selectedVariant, setSelectedVariant] = useState<VariantResource | null>(null)
    const dispatch = useDispatch<AppDispatch>()

    const fetchProduct = async () => {
        const response = await productService.getProductById(productId)
        setProduct(response.data)
    }

    const fetchVariants = async () => {
        const response = await variantService.getUniqueColorVariantsByProductId(productId);
        const responseData = response.data
        setVariants(responseData)
    }

    const fetchUniqueSizeVariants = async () => {
        const response = await variantService.getUniqueSizeVariantsByProductId(productId);
        const responseData = response.data
        setUniqueSizeVariants(responseData)
    }

    useEffect(() => {
        fetchProduct()
        fetchVariants()
        fetchUniqueSizeVariants()
    }, [productId])

    const handleColorChange = async (colorId: number, colorItem: ColorResource) => {
        const response = await variantService.getAllVariantsByProductIdAndColorId(productId, colorId);
        const responseData = response.data

        if(responseData.length > 0) {
            setSelectedVariant(responseData[0])
            setSize(responseData[0].size)
        } 

        setUniqueSizeVariants(responseData)
        setColor(colorItem)
    }

    const handleSizeChange = (sizeId: number, sizeItem: SizeResource) => {
        setSize(sizeItem)
        const findVariant = uniqueSizeVariants.find(v => v.color.id === color?.id && v.size.id === sizeId)
        if (findVariant) {
            setSelectedVariant(findVariant)
        }
    }

    const handleClickBtnCart = () => {
        const payload: CartItemPayload = {
            price: product?.price!,
            variant: selectedVariant!,
            quantity: count,
            product: product!
        }

        dispatch(addNewOrIncreaseQuantity(payload))
        message.success('Thêm sản phẩm vào giỏ hàng thành công')
    }

    return <div className="grid grid-cols-2 gap-x-6">
        <div>
            <Image preview={false} width='100%' height='480px' className="object-cover" src={selectedVariant?.thumbnailUrl ?? product?.thumbnail} />
        </div>
        <div className="flex flex-col gap-y-4 items-start">
            <span className="text-4xl font-semibold">{product?.name}</span>
            <div className="flex gap-x-4">
                <span className="text-lg">Thể loại: <b>{product?.category.name}</b></span>
                <span className="text-lg">Thương hiệu: <b>{product?.brand.name}</b></span>
            </div>
            <div className="flex gap-x-3 items-center">
                <span className="line-through text-lg">{formatCurrencyVND(product?.oldPrice)}</span>
                <span className="text-primary text-2xl font-semibold">{formatCurrencyVND(product?.price)}</span>
            </div>
            <div className="flex flex-col gap-y-1">
                <div>
                    <span className="text-lg">Màu sắc: <b>{color?.name}</b></span>
                    <GroupColorRadio
                        defaultValue={color?.id!}
                        onChange={handleColorChange}
                        colors={variants.map(v => v.color)}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg">Kích cỡ: <b>{size?.eSize}</b></span>
                    <Tooltip placement="right" title={!color && 'Vui lòng chọn màu sắc trước'}>
                        <button disabled={!color}>
                            <GroupSizeRadio
                                value={size?.id!}
                                defaultValue={size?.id!}
                                onChange={handleSizeChange}
                                sizes={uniqueSizeVariants.map(v => v.size)}
                            />
                        </button>
                    </Tooltip>
                </div>

            </div>

            <div className="flex gap-x-2 items-center">
                <span className="text-lg">Số lượng</span>
                <div className="flex gap-x-4 items-center">
                    <QuantityButton size="small" defaultValue={1} onChange={value => setCount(value)} />
                </div>
            </div>

            <Tooltip title={!selectedVariant && 'Vui lòng chọn màu sắc và kích cỡ'}>
                <Button
                    disabled={!selectedVariant}
                    onClick={handleClickBtnCart}
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                >Thêm vào giỏ hàng</Button>
            </Tooltip>

            <Link to={`/product/${productId}`} className="text-[14px] font-semibold flex gap-x-2 underline">
                <span>
                    Xem đầy đủ
                </span>
                <ArrowRightOutlined />
            </Link>
        </div>
    </div>

};

export default QuickViewModal;
