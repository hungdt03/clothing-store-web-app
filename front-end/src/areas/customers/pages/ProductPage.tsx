import { Badge, Breadcrumb, Button, Empty, Image, Rate, Skeleton, Tabs, TabsProps, Tooltip, message } from "antd";
import { FC, useEffect, useState } from "react";
import GroupColorRadio from "../components/GroupColorRadio";
import { ShoppingCartOutlined } from '@ant-design/icons';
import GroupSizeRadio from "../components/GroupSizeRadio";
import QuantityButton from "../components/QuantityButton";
import Review from "../components/Review";
import ReviewAnalytic from "../components/ReviewAnalytic";
import { useParams } from "react-router-dom";
import { ColorResource, ProductResource, ReportEvaluationResource, SizeResource, VariantResource } from "../../../resources";
import productService from "../../../services/product-service";
import variantService from "../../../services/variant-service";
import { CartItemPayload, addNewOrIncreaseQuantity } from "../../../feature/cart/cartSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { formatCurrencyVND } from "../../../utils/format";
import evaluationService from "../../../services/evaluation-service";
import EvaluationSkeleton from "../../shared/skeleton/EvaluationSkeleton";

type ReviewTabProps = {
    productId: number | string;
}

const ReviewTab: FC<ReviewTabProps> = ({
    productId
}) => {
    const [reportEvaluation, setReportEvaluation] = useState<ReportEvaluationResource>();
    const [loading, setLoading] = useState(false)

    const fetchEvaluations = async () => {
        const response = await evaluationService.getAllByProductId(productId);
        setReportEvaluation(response.data)
    }

    useEffect(() => {
        setLoading(true)
        fetchEvaluations()
        setLoading(false)
    }, [productId])

    return (reportEvaluation?.report.totalEvaluation === 0) ? <Empty description='Chưa có lượt đánh giá nào' /> :
        (<div className="grid grid-cols-12 gap-x-10">
            <div className="col-span-5">
                {loading ? <Skeleton paragraph active /> : <>
                    <p className="font-semibold mb-4">Reviews & Rating</p>
                    <div className="flex gap-x-4 items-start">
                        <div className="flex flex-col items-start gap-y-3">
                            <div className="flex items-end gap-x-1">
                                <span className="font-bold text-4xl">{reportEvaluation?.report.averageStar.toFixed(1)}</span>
                                <span className="text-gray-600 font-semibold text-xs">/5.0</span>
                            </div>
                            <Rate className="text-sm" allowHalf disabled value={reportEvaluation?.report.averageStar} />
                            <span className="text-gray-600 font-semibold text-xs">{reportEvaluation?.report.totalEvaluation} reviews</span>
                        </div>

                        <div className="flex flex-col gap-y-3 flex-1 px-10">
                            {reportEvaluation && <ReviewAnalytic starPercents={reportEvaluation?.report.starsPercents} />}
                        </div>
                    </div>
                </>}
            </div>
            <div className="col-span-7">
                {loading ? <EvaluationSkeleton /> : reportEvaluation?.results.map(review => <Review onInteract={fetchEvaluations} key={review.id} review={review} />)}
            </div>
        </div>)
}

const onChange = (key: string) => {
    console.log(key);
};


const ProductPage: FC = () => {

    const { id } = useParams()
    const [product, setProduct] = useState<ProductResource | null>(null)
    const [variants, setVariants] = useState<VariantResource[]>([]);
    const [uniqueSizeVariants, setUniqueSizeVariants] = useState<VariantResource[]>([])
    const [color, setColor] = useState<ColorResource | null>()
    const [size, setSize] = useState<SizeResource | null>()
    const [count, setCount] = useState(1)
    const [selectedVariant, setSelectedVariant] = useState<VariantResource | null>(null)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        const fetchProduct = async () => {
            const response = await productService.getProductById(id!);
            setProduct(response.data)
        }

        const fetchVariants = async () => {
            const response = await variantService.getUniqueColorVariantsByProductId(id!);
            const responseData = response.data
            setVariants(responseData)
        }

        const fetchUniqueSizeVariants = async () => {
            const response = await variantService.getUniqueSizeVariantsByProductId(id!);
            const responseData = response.data
            setUniqueSizeVariants(responseData)
        }

        fetchProduct();
        fetchVariants();
        fetchUniqueSizeVariants();
    }, [id])

    const handleColorChange = async (colorId: number, colorItem: ColorResource) => {
        const response = await variantService.getAllVariantsByProductIdAndColorId(id!, colorId);
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


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin về sản phẩm',
            children: 'Content of Tab Pane 1',
        },
        {
            key: '2',
            label: 'Lượt đánh giá',
            children: <ReviewTab productId={id!} />,
        },

    ];


    return <div className="px-10">
        <Breadcrumb
            className="my-10 text-[17px]"
            separator=">"
            items={[
                {
                    title: 'Trang chủ',
                },
                {
                    title: 'Sản phẩm',
                    href: '/shop',
                },
                {
                    title: <span className="font-semibold">{product?.name}</span>,
                    href: '',
                },
            ]}
        />

        <div className="grid grid-cols-12 gap-x-10 mb-8">
            <div className="col-span-5">
                <Image.PreviewGroup
                    preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                >
                    {product?.quantity! > 0 ? <Image className="rounded-3xl" width='100%' src={selectedVariant?.thumbnailUrl ?? product?.thumbnail} />
                        : <Badge.Ribbon placement="end" text="Hết hàng" color="volcano">
                            <Image className="rounded-3xl" width='100%' src={selectedVariant?.thumbnailUrl ?? product?.thumbnail} />
                        </Badge.Ribbon>}

                    <div className="flex items-center gap-x-4 mt-4">
                        {product?.images.map(image => <Image width='80px' height='80px' key={image.id} className="rounded-3xl object-cover" src={image.url} />)}
                    </div>
                </Image.PreviewGroup>

            </div>
            <div className="col-span-7 flex flex-col gap-y-4 items-start">
                <h2 className="text-5xl font-semibold">{product?.name}</h2>
                <div className="flex gap-x-4">
                    <span className="text-lg">Thể loại: <b>{product?.category.name}</b></span>
                    <span className="text-lg">Thương hiệu: <b>{product?.brand.name}</b></span>
                </div>
                <p className="text-lg">{product?.description}</p>
                <div className="flex gap-x-4 items-center">
                    <Rate className="text-sm" disabled defaultValue={4} />
                    <span className="text-gray-600 font-semibold text-sm">2.3k+ reviews</span>
                </div>
                <div className="flex gap-x-3 items-center">
                    <span className="line-through text-lg">{formatCurrencyVND(product?.oldPrice)}</span>
                    <span className="text-primary text-2xl font-semibold">{formatCurrencyVND(product?.price)}</span>
                </div>

                <div>
                    <span className="text-lg">Màu sắc: {color?.name}</span>
                    <GroupColorRadio
                        defaultValue={color?.id!}
                        onChange={handleColorChange}
                        colors={variants.map(v => v.color)}
                    />
                </div>

                <div className="flex flex-col">
                    <span className="text-lg">Kích cỡ: {size?.eSize}</span>
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


                <div className="flex flex-col gap-y-3 items-start">
                    <span className="text-lg">Số lượng</span>
                    <div className="flex gap-x-4 items-center">
                        <QuantityButton defaultValue={1} onChange={value => setCount(value)} />
                        <Tooltip title={!size && 'Vui lòng chọn màu sắc và kích cỡ'}>
                            <Button
                                disabled={!size}
                                onClick={handleClickBtnCart}
                                type="primary"
                                size="large"
                                icon={<ShoppingCartOutlined />}
                            >Thêm vào giỏ hàng</Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>

        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
};

export default ProductPage;
