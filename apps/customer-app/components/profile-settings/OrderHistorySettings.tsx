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

// Example product order history data
const data: Order[] =
    [
        {
            id: "p1a9sd01",
            name: "Wireless Headphones",
            image_url: "https://images.unsplash.com/photo-1518443871546-8b12650d3f54?auto=format&fit=crop&w=800&q=80",
            price: 129.99,
            seller_name: "SoundTech",
            discount: 10,
            quantity: 1,
            created_at: "2024-05-19T13:10:00Z"
        },
        {
            id: "p2b8sq11",
            name: "Smartphone Case",
            image_url: "https://images.unsplash.com/photo-1603898037225-c26f72778f07?auto=format&fit=crop&w=800&q=80",
            price: 19.99,
            seller_name: "CaseWorld",
            discount: 0,
            quantity: 2,
            created_at: "2024-04-22T09:33:00Z"
        },
        {
            id: "p3c7vm44",
            name: "USB-C Fast Charger",
            image_url: "https://images.unsplash.com/photo-1586943359263-6ce21644b92d?auto=format&fit=crop&w=800&q=80",
            price: 39.95,
            seller_name: "QuickCharge",
            discount: 5,
            quantity: 1,
            created_at: "2024-03-17T21:55:00Z"
        },
        {
            id: "p4d5kw81",
            name: "Mechanical Keyboard",
            image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
            price: 89.5,
            seller_name: "KeyLab",
            discount: 12,
            quantity: 1,
            created_at: "2024-05-01T10:45:00Z"
        },
        {
            id: "p5e4qp22",
            name: "4K LED Monitor 27\"",
            image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
            price: 329.0,
            seller_name: "VisionTech",
            discount: 8,
            quantity: 1,
            created_at: "2024-06-09T14:20:00Z"
        },
        {
            id: "p6f9zl52",
            name: "Bluetooth Speaker",
            image_url: "https://images.unsplash.com/photo-1585386959984-a41552231683?auto=format&fit=crop&w=800&q=80",
            price: 59.99,
            seller_name: "SoundBoost",
            discount: 15,
            quantity: 1,
            created_at: "2024-05-11T12:00:00Z"
        },
        {
            id: "p7g3ht90",
            name: "Gaming Mouse",
            image_url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
            price: 34.99,
            seller_name: "ProGear",
            discount: 7,
            quantity: 1,
            created_at: "2024-04-14T18:22:00Z"
        },
        {
            id: "p8h6wx10",
            name: "Laptop Cooling Pad",
            image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
            price: 24.5,
            seller_name: "CoolMaster",
            discount: 0,
            quantity: 1,
            created_at: "2024-03-29T11:18:00Z"
        },
        {
            id: "p9j2lp95",
            name: "1080p Web Camera",
            image_url: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=800&q=80",
            price: 44.99,
            seller_name: "StreamVision",
            discount: 10,
            quantity: 1,
            created_at: "2024-02-25T16:33:00Z"
        },
        {
            id: "p10k8rf14",
            name: "Portable SSD 1TB",
            image_url: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=800&q=80",
            price: 119.0,
            seller_name: "DataSafe",
            discount: 5,
            quantity: 1,
            created_at: "2024-06-20T07:40:00Z"
        },
        {
            id: "p11l7qa88",
            name: "Smartwatch Pro",
            image_url: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=800&q=80",
            price: 149.99,
            seller_name: "TimeSync",
            discount: 12,
            quantity: 1,
            created_at: "2024-06-07T10:00:00Z"
        },
        {
            id: "p12m4ws77",
            name: "Noise-Cancelling Earbuds",
            image_url: "https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=800&q=80",
            price: 79.99,
            seller_name: "AudioFlex",
            discount: 10,
            quantity: 1,
            created_at: "2024-05-15T15:55:00Z"
        },
        {
            id: "p13n5dz33",
            name: "Action Camera 4K",
            image_url: "https://images.unsplash.com/photo-1519181245277-cffeb31da2fb?auto=format&fit=crop&w=800&q=80",
            price: 199.99,
            seller_name: "AdventureCam",
            discount: 5,
            quantity: 1,
            created_at: "2024-04-10T09:12:00Z"
        },
        {
            id: "p14p3bg66",
            name: "Wireless Power Bank 20,000mAh",
            image_url: "https://images.unsplash.com/photo-1587755200585-8b4e1a4a7c17?auto=format&fit=crop&w=800&q=80",
            price: 49.99,
            seller_name: "ChargeMax",
            discount: 0,
            quantity: 1,
            created_at: "2024-03-14T08:22:00Z"
        },
        {
            id: "p15q8xy41",
            name: "LED Desk Lamp",
            image_url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
            price: 29.99,
            seller_name: "BrightHome",
            discount: 3,
            quantity: 1,
            created_at: "2024-01-19T17:05:00Z"
        }
    ]


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