import { Button, Form, FormProps, Rate, Select, message } from "antd";
import { FC, useEffect, useState } from "react";
import { EvaluationResource } from "../../../../resources";
import evaluationService from "../../../../services/evaluation-service";
import settingService from "../../../../services/setting-service";


export type ReviewShowRequest = {
    evaluationIds: number[]
};

type CreateReviewShowModalProps = {
    handleOk: () => void;
}

const CreateReviewShowModal: FC<CreateReviewShowModalProps> = ({
    handleOk
}) => {
    const [form] = Form.useForm<ReviewShowRequest>();
    const [evaluations, setEvaluations] = useState<EvaluationResource[]>([])

    const onFinish: FormProps<ReviewShowRequest>['onFinish'] = async (values) => {
        console.log(values)
        const response = await settingService.createReviewShow(values);

        if (response.success) {
            message.success(response.message)
            form.resetFields();
            handleOk()
        } else message.error(response.message)

    };

    const fetchExcellentEvaluation = async () => {
        const response = await evaluationService.getAllExcellentEvaluations();
        setEvaluations(response.data)
    }

    useEffect(() => {
        fetchExcellentEvaluation();
    }, [])

    const onFinishFailed: FormProps<ReviewShowRequest>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return <div className="px-4 pt-4 max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4">
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            initialValues={{
                evaluationIds: []
            }}
            layout="vertical"
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<ReviewShowRequest>
                label="Chọn các đánh giá"
                name="evaluationIds"
                rules={[{
                    required: true,
                    message: 'Vui lòng chọn ít nhất một đánh giá!',
                }]}
            >
                <Select
                    size="large"
                    defaultValue={0}
                    mode="multiple"
                >
                    {evaluations.map(evaluation => <Select.Option key={evaluation.id} value={evaluation.id}>
                        <div className="flex items-center justify-between">
                            <span className="w-[180px] truncate line-clamp-1">{evaluation.content} ({evaluation.user?.name})</span>
                            <Rate disabled className="text-[10px]" value={evaluation.stars} />
                        </div>
                    </Select.Option>)}
                </Select>
            </Form.Item>

            <div className="flex justify-end">
                <Form.Item>
                    <Button shape="round" size="large" className="mt-4" type="primary" htmlType="submit">
                        Lưu lại
                    </Button>
                </Form.Item>
            </div>
        </Form>
    </div>
};

export default CreateReviewShowModal;