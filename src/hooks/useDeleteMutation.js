import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const useDeleteMutation = (queryKey, deleteEndPoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    // 1. API CALL
    mutationFn: async ({ ids, deleteType }) => {
      const { data } = await axios({
        url: deleteEndPoint,
        method: deleteType === "PD" ? "DELETE" : "PUT",
        data: { ids, deleteType },
      });

      if (!data.success) throw new Error(data.message);
      return data;
    },


    // 2. SUCCESS HANDLER
    onSuccess: (data) => {
      // Refresh the media list
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(data.message);
    },

    // 3. ERROR HANDLER
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });
};

export default useDeleteMutation;
