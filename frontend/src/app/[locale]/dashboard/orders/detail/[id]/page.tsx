"use client";
import {
  Dialog as DialogWrapper,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderDetail } from "@/types/order";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDate, formatIDR } from "@/utils";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
interface Props {
  params: {
    id: string;
  };
}
const AccordionDetail = ({ label, data }: { label: string; data: Object }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>{label}</AccordionTrigger>
        <AccordionContent>
          <pre className="text-wrap h-60 overflow-auto block w-450px">
            {JSON.stringify(data, null, 2)}
          </pre>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
const RenderDetail = ({ label, value }: { label: string; value: any }) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center">
        <Label className="text-left">{label}</Label>
        <Input defaultValue={value} disabled={true} className="col-span-3" />
      </div>
    </>
  );
};

const DetailOrderPage = ({ params }: Props) => {
  const { push } = useRouter();
  const { data: order, isLoading } = useSWR<OrderDetail>(
    `/orders/${params.id}`,
    async (url: string) => await fetcher(url, "order")
  );

  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      {!isLoading && order ? (
        <DialogWrapper
          defaultOpen={true}
          onOpenChange={(e) => {
            push("/dashboard/orders");
          }}>
          <DialogContent className="sm:max-w-[450px] z-50 max-h-full overflow-auto">
            <DialogHeader>
              <DialogTitle>Order Detail</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 overflow-auto">
              <RenderDetail label={"id"} value={order["_id"]} />
              <RenderDetail label={"user"} value={order["user"]} />
              <RenderDetail label={"status"} value={order["status"]} />
              <RenderDetail label={"shipping price"} value={formatIDR(order["shipping"].price)} />
              <RenderDetail label={"tax price"} value={formatIDR(order["taxPrice"])} />
              <RenderDetail label={"total amount"} value={formatIDR(order["totalAmount"])} />
              <RenderDetail label={"payment method"} value={order["payment"]} />
              <RenderDetail label={"is paid"} value={order["payment"].isPaid} />
              <RenderDetail
                label={"paidAt"}
                value={formatDate(new Date(order["payment"].paidAt))}
              />
              <RenderDetail label={"isDelivered"} value={order["isDelivered"]} />
              <RenderDetail
                label={"deliveredAt"}
                value={formatDate(new Date(order["deliveredAt"]))}
              />

              <AccordionDetail label="order items" data={order.orderItems} />
              <AccordionDetail label="shipping address" data={order.shippingAddress} />
            </div>
          </DialogContent>
        </DialogWrapper>
      ) : (
        <p>Loading....</p>
      )}
    </>
  );
};

export default DetailOrderPage;
