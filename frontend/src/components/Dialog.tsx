import { Button } from "@/components/ui/button";
import {
  Dialog as DialogWrapper,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InputLabel from "./InputLabel";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/context/authContext";
import { ProductItemOrder } from "@/types/order";
import Image from "next/image";
import Link from "next/link";
import apiService from "@/lib/axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: ProductItemOrder;
  itemId: string; // id of cart items
}

const ReviewSchema = z.object({
  comment: z.string().min(3).max(200),
  rating: z.number().min(1).max(5),
});

export type ReviewType = z.infer<typeof ReviewSchema>;
const Dialog = ({ open, setOpen, product, itemId }: Props) => {
  const { register, handleSubmit } = useForm<ReviewType>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { refresh } = useRouter();
  const onSubmit = async (data: ReviewType) => {
    try {
      const res = await apiService.post(`/products/${product._id}/reviews`, {
        ...data,
        user: user?._id,
        product: product._id,
        cartItem: itemId,
      });
      if (res.status != 201) {
        toast({
          title: "Notif",
          description: "add review failed!",
        });
      }
      toast({
        title: "Notif",
        description: "add review success!",
      });
      // refresh();
      window.location.reload()
    } catch (error) {
      console.log(error);
      toast({
        title: "Notif",
        description: "add review failed!",
      });
    } finally {
      setOpen(false);
    }
  };
  return (
    <DialogWrapper defaultOpen={true} onOpenChange={(op) => setOpen(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add review</DialogTitle>
            <DialogDescription>
              Express your feelings after shopping
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 my-2">
            <div className="relative min-w-16 sm:min-w-20 h-14 sm:h-20 rounded border-rounded">
              <Image src={product.images[0]} fill alt={product.name} />
            </div>
            <div className="flex flex-col">
              <Link
                href={`/products/${product._id}`}
                className="text-sm hover:underline"
              >
                {product.name}
              </Link>
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <InputLabel
              {...register("rating", { required: true })}
              label="rating"
              type="number"
              min={1}
              max={5}
            />
            <div className="">
              <label>review</label>
              <Textarea
                maxLength={150}
                minLength={3}
                placeholder="comment"
                {...register("comment", { required: true })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Review</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogWrapper>
  );
};

export default Dialog;
