import { FC, useEffect, useState } from "react";
import { BlogResource } from "../../../../resources";
import blogService from "../../../../services/blog-service";
import { Button, Image, Popconfirm, Space, Table, TableProps, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const TitleHeader: FC = () => {
    return <div className="flex justify-between items-center">
        <span className="font-semibold text-xl">Bài viết</span>

        <Link to={`/admin/blog/create`}>
            <Button type="primary" icon={<PlusOutlined />}>Thêm</Button>
        </Link>
    </div>
}



const BlogManagement: FC = () => {
    const [blogs, setBlogs] = useState<BlogResource[]>([])

    const confirmRemove = async (id: number) => {
        await blogService.deleteBlog(id)
        fetchBlogs()
        message.success('Xóa bài viết thành công');
    };

    const columns: TableProps<BlogResource>['columns'] = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render(value) {
                return <Image preview={false} width='70px' height='70px' className="object-cover rounded-lg" src={value} />
            }
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render(value) {
                return <p
                    className="text-[16px] line-clamp-1"
                >
                    {value}
                </p>
            }
        },
        {
            title: 'Nội dụng',
            dataIndex: 'content',
            key: 'content',
            render(value) {
                return <div
                    className="text-[16px] line-clamp-1"
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isHidden',
            key: 'isHidden',
            render(value, record) {
                console.log(value)
                return <Button onClick={() => toggleHidden(record.id, value)} shape="circle" type="default">
                    {value ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                </Button>
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Xóa bài viết"
                        description="Bạn có chắc là muốn xóa bài viết này?"
                        okText="Chắc chắn"
                        cancelText="Hủy bỏ"
                        onConfirm={() => confirmRemove(record.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger type="primary" size="small">Xóa</Button>
                    </Popconfirm>
                    <Link to={`/admin/blog/edit/${record.id}`}><Button icon={<EditOutlined />} danger type="dashed" size="small">Sửa</Button></Link>
                </Space>
            ),
        },
    ];

    const toggleHidden = async (id: number, value: boolean) => {
        if (value) {
            await blogService.showBlog(id)
        } else {
            await blogService.hiddenBlog(id)
        }

        fetchBlogs()
    }

    const fetchBlogs = async () => {
        const response = await blogService.getAllBlogs();
        setBlogs(response.data);
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    return <div>
        <Table
            columns={columns}
            dataSource={blogs}
            rowKey='id'
            title={() => <TitleHeader />}
            pagination={{
                pageSize: 8,
            }}
        />
    </div>
};

export default BlogManagement;
