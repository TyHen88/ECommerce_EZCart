import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { DataTableTemplate } from "../shared/DataTableTemplate"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

type Order = {
    id: string
    name: string
    image_url: string
    price: number
    seller_name: string
    discount: number
    quantity: number
    created_at: string
}

// TODO: Replace with actual order API call when available
// For now, using empty array until order service is implemented
const data: Order[] = []

export const columns: ColumnDef<Order>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => {
            const imageUrl = row.original.image_url;
            const name = row.getValue("name") as string;
            return (
                <div className="flex items-center gap-3">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-10 h-10 object-cover rounded"
                    />
                    <span className="capitalize">{name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Price
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            const price = row.getValue("price") as number;
            const discount = row.original.discount;
            return (
                <div>
                    {discount > 0 ? (
                        <span>
                            <span className="text-muted-foreground line-through mr-1">${price.toFixed(2)}</span>
                            <span className="text-green-600 font-semibold">
                                ${(price * (1 - discount / 100)).toFixed(2)}
                            </span>
                        </span>
                    ) : (
                        <span>${price.toFixed(2)}</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "seller_name",
        header: "Seller",
        cell: ({ row }) => <div>{row.original.seller_name}</div>,
    },
    {
        accessorKey: "discount",
        header: "Discount (%)",
        cell: ({ row }) => (
            <div>{row.original.discount > 0 ? `-${row.original.discount}%` : "-"}</div>
        ),
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Quantity
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
    },
    {
        accessorKey: "created_at",
        header: () => <div className="text-right">Date</div>,
        cell: ({ row }) => {
            const created_at = row.getValue("created_at") as string
            return (
                <div className="text-right font-medium">
                    {new Date(created_at).toLocaleDateString()} <span className="text-xs text-muted-foreground">{new Date(created_at).toLocaleTimeString()}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const price = row.original.price;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(price.toString())}
                        >
                            Copy price
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View order details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const OrderHistorySettings = () => {
    return (
        <DataTableTemplate data={data} columns={columns} searchColumn={"name"} />
    )
}

export default OrderHistorySettings;