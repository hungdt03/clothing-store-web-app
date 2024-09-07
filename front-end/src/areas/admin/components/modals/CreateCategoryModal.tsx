import { Button, Form, FormProps, Input, Select, message } from "antd";
import { FC } from "react";
import categoryService from "../../../../services/category-service";
import { CategoryResource } from "../../../../resources";

export type CategoryRequest = {
    name?: string;
    description?: string;
    parentCategoryId?: number;
};

type CreateCategoryModalProps = {
    handleOk: () => void;
    categories: CategoryResource[]
}

const CreateCategoryModal: FC<CreateCategoryModalProps> = ({
    handleOk,
    categories
}) => {

    const [form] = Form.useForm<CategoryRequest>(); 
    const onFinish: FormProps<CategoryRequest>['onFinish'] = async (values) => {
        const response = await categoryService.createCategory(values);
        message.success(response.message)
        form.resetFields();
        handleOk()
    };

    const onFinishFailed: FormProps<CategoryRequest>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return <div className="px-4 pt-4 max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-h-4">
        <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            initialValues={{
                parentCategoryId: 0
            }}
            layout="vertical"
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<CategoryRequest>
                label="Danh mục cha"
                name="parentCategoryId"
            >
                <Select 
                    size="large"
                >
                    <Select.Option value={0} key={0}>Không có danh mục cha</Select.Option>
                    {categories.map(category => <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>)}
                </Select>
            </Form.Item>

            <Form.Item<CategoryRequest>
                label="Tên danh mục"
                name="name"
                rules={[{ required: true, message: 'Tên danh mục không được để trống!' }]}
            >
                <Input size="large" placeholder="Tên danh mục ..." />
            </Form.Item>

            <Form.Item<CategoryRequest>
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Mô tả danh mục không được để trống!' }]}
            >
                <Input.TextArea size="large" placeholder="Mô tả ..." />
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

export default CreateCategoryModal;