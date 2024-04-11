import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { currencyNumber } from "@/components/utilities";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { SearchOutlined } from "@ant-design/icons";

import {
    CreateButton,
    DeleteButton,
    EditButton,
    FilterDropdown,
    List,
    useTable,
} from "@refinedev/antd";
import { useGo, getDefaultFilter } from "@refinedev/core";
import { Input, Pagination, Space, Table } from "antd";
import { CompaniesListQuery } from "@/graphql/types";
import { PaginationTotal } from "@/components/pagination-total";

type Company = GetFieldsFromList<CompaniesListQuery>;

export const CompanyList = ({ children }: React.PropsWithChildren) => {
    const { tableProps, filters } = useTable({
        resource: "companies",
        onSearch: (values) => {
            return [{ field: "name", operator: "contains", value: values.name }];
        },
        pagination: {
            pageSize: 12,
        },
        sorters: {
            initial: [
                {
                    field: "createdAt",
                    order: "desc",
                },
            ],
        },
        filters: {
            initial: [{ field: "name", operator: "contains", value: undefined }],
        },
        meta: {
            gqlQuery: COMPANIES_LIST_QUERY,
        },
    });

    const go = useGo();

    return (
        <div className="page-container">
            <List
                breadcrumb={false}
                headerButtons={() => {
                    return (
                        <CreateButton
                            onClick={() => {
                                // modal is a opening from the url (/companies/new)
                                // to open modal we need to navigate to the create page (/companies/new)
                                // we are using `go` function because we want to keep the query params
                                go({
                                    to: {
                                        resource: "companies",
                                        action: "create",
                                    },
                                    options: {
                                        keepQuery: true,
                                    },
                                    type: "replace",
                                });
                            }}
                        />
                    );
                }}>
                <Table
                    {...tableProps}
                    pagination={{
                        ...tableProps.pagination,
                        pageSizeOptions: ["12", "24", "48", "96"],
                        showTotal: (total) => (
                            <PaginationTotal total={total} entityName="companies" />
                        ),
                    }}
                    rowKey="id">
                    <Table.Column<Company>
                        dataIndex="name"
                        title="Company title"
                        defaultFilteredValue={getDefaultFilter("id", filters)}
                        filterIcon={<SearchOutlined />}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Input placeholder="Search Company" />
                            </FilterDropdown>
                        )}
                        render={(_, record) => {
                            return (
                                <Space>
                                    <CustomAvatar
                                        shape="square"
                                        name={record.name}
                                        src={record.avatarUrl}
                                    />
                                    <Text
                                        style={{
                                            whiteSpace: "nowrap",
                                        }}>
                                        {record.name}
                                    </Text>
                                </Space>
                            );
                        }}
                    />
                    <Table.Column<Company>
                        dataIndex={"totalRevenue"}
                        title="Open deals amount"
                        render={(_, company) => {
                            return (
                                <Text>
                                    {currencyNumber(company?.dealsAggregate?.[0].sum?.value || 0)}
                                </Text>
                            );
                        }}
                    />
                    <Table.Column<Company>
                        fixed="right"
                        dataIndex="id"
                        title="Actions"
                        render={(value) => (
                            <Space>
                                <EditButton hideText size="small" recordItemId={value} />

                                <DeleteButton hideText size="small" recordItemId={value} />
                            </Space>
                        )}
                    />
                </Table>
            </List>
            {children}
        </div>
    );
};
