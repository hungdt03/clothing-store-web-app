import { FC, useEffect, useState } from "react";
import CardBorder from "../components/CardBorder";
import { DatePickerProps, DatePicker, Empty } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightDots } from "@fortawesome/free-solid-svg-icons";
import { OrderReport, OrderReportByMonth, ProductReport, ReportResource } from "../../../resources";
import reportService from "../../../services/report-service";
import ReactApexChart from "react-apexcharts";
import { formatCurrencyVND, formatMonthYear } from "../../../utils/format";

const { RangePicker } = DatePicker;



const initialValues: ReportResource = {
    orders: 0,
    products: 0,
    totalCost: 0,
    totalRevenue: 0,
    profit: 0,
    newestOrders: []
}

export type ReportQuery = {
    type: '' | 'today' | 'yesterday' | 'week' | 'month';
    from: string | null,
    to: string | null
}

const reportInit: ReportQuery = {
    type: '',
    from: null,
    to: null
}

const Dashboard: FC = () => {
    const [report, setReport] = useState<ReportResource>(initialValues)
    const [reportQuery, setReportQuery] = useState<ReportQuery>(reportInit)
    const [topProduct, setTopProduct] = useState<ProductReport[]>([]);
    const [orders, setOrders] = useState<OrderReport[]>([])
    const [orderMonth, setOrderMonth] = useState<OrderReportByMonth[]>([])
    const [year, setYear] = useState<string | number>('2024')
    const [month, setMonth] = useState<Date>(new Date())

    useEffect(() => {

        fetchTopProduct()
        fetchOrderPercent()
        fetchReporOrderByMonth()
    }, [])

    const fetchTopProduct = async () => {
        const response = await reportService.getTopFiveBestSellerProducts()
        setTopProduct(response.data)
    }

    const fetchReporOrderByMonth = async (time?: Date) => {
        const response = await reportService.getOrderByMonth(time)
        setOrderMonth(response.data)
    }

    const fetchOrderPercent = async (year: number | string = 2024) => {
        const response = await reportService.getOrderPercentInRangeYear(year)
        setOrders(response.data)
    }

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setYear(dateString as string)
        fetchOrderPercent(dateString as string)
    };

    const onMonthChange: DatePickerProps['onChange'] = (date, dateString) => {
        setMonth(new Date(dateString as string))
        fetchReporOrderByMonth(new Date(dateString as string))
    };

    useEffect(() => {
        const fetchReportData = async (query: ReportQuery) => {
            const response = await reportService.getReportData(query);
            console.log(response)
            setReport(response.data)
        }

        fetchReportData(reportQuery)
    }, [reportQuery])


    return <div className="flex flex-col gap-6">
        <CardBorder padding='2' className="px-4">
            <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Thống kê bán hàng</span>
                <div className="flex items-center gap-x-4">
                    <button onClick={() => {
                        setReportQuery({
                            ...reportQuery,
                            type: 'today'
                        })
                    }} className={`bg-slate-100 px-4 py-1 rounded-md hover:text-primary hover:bg-orange-50 ${reportQuery.type === 'today' && 'text-primary bg-orange-50'}`}>Hôm nay</button>

                    <button onClick={() => {
                        setReportQuery({
                            ...reportQuery,
                            type: 'yesterday'
                        })
                    }} className={`bg-slate-100 px-4 py-1 rounded-md hover:text-primary hover:bg-orange-50 ${reportQuery.type === 'yesterday' && 'text-primary bg-orange-50'}`}>Hôm qua</button>

                    <button onClick={() => {
                        setReportQuery({
                            ...reportQuery,
                            type: 'week'
                        })
                    }} className={`bg-slate-100 px-4 py-1 rounded-md hover:text-primary hover:bg-orange-50 ${reportQuery.type === 'week' && 'text-primary bg-orange-50'}`}>7 ngày qua</button>

                    <button onClick={() => {
                        setReportQuery({
                            ...reportQuery,
                            type: 'month'
                        })
                    }} className={`bg-slate-100 px-4 py-1 rounded-md hover:text-primary hover:bg-orange-50 ${reportQuery.type === 'month' && 'text-primary bg-orange-50'}`}>Tháng này</button>
                    |
                    <RangePicker onChange={(values) => {
                        if (values) {
                            const [startDate, endDate] = values;
                            const start = startDate!.format('YYYY-MM-DD'); 
                            const end = endDate!.format('YYYY-MM-DD');
                            setReportQuery({
                                ...reportQuery,
                                type: '',
                                from: start,
                                to: end
                            })
                        } else {
                            console.log('No dates selected');
                        }
                    }} />
                </div>
            </div>
        </CardBorder>
        <CardBorder>
            <div className="grid grid-cols-4 gap-6">
                <div className="rounded-xl px-4 py-4 bg-orange-100 flex flex-col gap-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] font-semibold">Sản phẩm</span>
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                    </div>
                    <span className="font-bold text-3xl">
                        {report?.products}
                    </span>
                    <p>sản phẩm đã được bán</p>
                </div>
                <div className="rounded-xl px-4 py-4 bg-green-100 flex flex-col gap-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] font-semibold">Đơn hàng</span>
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                    </div>
                    <span className="font-bold text-3xl">
                        {report.orders}
                    </span>
                    <p>đơn hàng đã được đặt</p>
                </div>


                <div className="rounded-xl px-4 py-4 bg-sky-100 flex flex-col gap-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] font-semibold">Doanh thu</span>
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                    </div>
                    <span className="font-bold text-3xl">
                        {formatCurrencyVND(report.totalRevenue)}
                    </span>
                    <p>số tiền thu về</p>
                </div>
                <div className="rounded-xl px-4 py-4 bg-gray-100 flex flex-col gap-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] font-semibold">Lợi nhuận</span>
                        <FontAwesomeIcon icon={faArrowUpRightDots} />
                    </div>
                    <span className="font-bold text-3xl">
                        {formatCurrencyVND(report.profit)}
                    </span>
                    <p>sau khi đã trừ chi chí</p>
                </div>
            </div>


        </CardBorder>
        <CardBorder>
            <div className=" bg-slate-50 p-4 rounded-xl">
                <div className="flex gap-x-4 items-center justify-between">
                    <span className="block mb-2 font-semibold text-[15px]">Dữ liệu đơn hàng năm {year}</span>
                    <DatePicker onChange={onChange} picker="year" />
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                    <ReactApexChart
                        height='500px'
                        options={{
                            chart: {
                                type: 'line',
                            },
                            labels: orders.map(o => `Tháng ${o.month}`),
                            dataLabels: {
                                enabled: true,
                                formatter: (val: number) => `${val}%`,
                            },
                            stroke: {
                                curve: 'smooth',
                            },
                            markers: {
                                size: 0,
                            },
                            xaxis: {
                                categories: orders.map(o => `Tháng ${o.month}`),
                            },
                        }}
                        series={[
                            {
                                name: 'Số lượng',
                                data: orders.map(o => o.total),
                            },
                            {
                                name: 'Tỉ lệ %',
                                data: orders.map(o => o.percent),
                            },
                        ]}
                        type="line"
                    />

                </div>
            </div>
        </CardBorder>

        <CardBorder className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl">
                <div className="flex gap-x-4 items-center justify-between">
                    <span className="block mb-2 font-semibold text-[15px]">Dữ liệu đơn hàng {formatMonthYear(month)}</span>
                    <DatePicker onChange={onMonthChange} picker="month" />
                </div>
                {orderMonth.length == 0 && <div className="flex items-center justify-center h-full"><Empty description='Không có dữ liệu' /></div>}
                <ReactApexChart
                    options={{
                        labels: orderMonth?.map(item => item.orderStatus),
                        dataLabels: {
                            enabled: true,
                            formatter: (val: number) => `${val.toFixed(2)}%`,
                        },
                        plotOptions: {
                            pie: {
                                expandOnClick: true,
                            },
                        },
                    }}
                    series={orderMonth?.map(item => item.total) ?? []}
                    type="donut"
                />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl">
                <span className="block mb-2 font-semibold text-[15px]">Top {topProduct.length} sản phẩm được bán nhiều nhất</span>
                <ReactApexChart
                    options={{
                        labels: topProduct?.map(item => item.product.name),
                        dataLabels: {
                            enabled: true,
                            formatter: (val: number) => `${val.toFixed(2)}%`,
                        },
                        plotOptions: {
                            pie: {
                                expandOnClick: true,
                            },
                        },
                    }}
                    series={topProduct?.map(item => item.quantity) ?? []}
                    type="donut"
                />
            </div>
        </CardBorder>

    </div>
};

export default Dashboard;
