"use client";
import {
  Dialog as DialogWrapper,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Product, TimeStamp } from "@/types";
import Image from "next/image";
import Loading from "@/components/Loading";
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

const DetailProductPage = ({ params }: Props) => {
  const { push } = useRouter();
  const { data: product, isLoading } = useSWR<Product & TimeStamp>(
    `/products/${params.id}`,
    async (url: string) => await fetcher(url, "product")
  );

  if (isLoading) return <Loading />;
  if (!product) return <p>Product not found</p>;
  return (
    <>
      <DialogWrapper
        defaultOpen={true}
        onOpenChange={(e) => {
          push("/dashboard/products");
        }}
      >
        <DialogContent className="sm:max-w-[450px] z-50 max-h-full overflow-auto">
          <DialogHeader>
            <DialogTitle>Order Detail</DialogTitle>
          </DialogHeader>
          <div className="relative w-28 h-28 border-rounded mx-auto">
            <Image src={product.images[0].url || ""} fill alt="image product" />
          </div>
          <div className="grid gap-4 py-4 overflow-auto">
            <RenderDetail label={"id"} value={product["_id"]} />
            <RenderDetail label={"name"} value={product["name"]} />
            <AccordionDetail label="Description" data={product.description} />
            <RenderDetail label={"stock"} value={product["stock"]} />
            <RenderDetail label={"ratings"} value={product["ratings"]} />
            <RenderDetail label={"price"} value={formatIDR(product["price"])} />
            <RenderDetail label={"sold_count"} value={product["sold_count"]} />
            <RenderDetail
              label={"categories"}
              value={product["categories"].map((c) => c.name).join(",")}
            />
            <RenderDetail
              label={"createdAt"}
              value={formatDate(new Date(product.createdAt))}
            />
          </div>
        </DialogContent>
      </DialogWrapper>
    </>
  );
};

export default DetailProductPage;
